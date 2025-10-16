require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('./models/activity');

async function migrateActivityCategories() {
    try {
        // Connect to MongoDB using environment variable
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for migration');

        // Find all activities with old category structure
        const activities = await Activity.find({
            category: { $in: ['article', 'journal'] }
        });

        console.log(`Found ${activities.length} activities to migrate`);

        for (let activity of activities) {
            const oldCategory = activity.category;
            
            // Set new category and subCategory
            activity.category = 'academic';
            activity.subCategory = oldCategory; // 'article' or 'journal'
            
            await activity.save();
            console.log(`Migrated: ${activity.title} (${oldCategory} -> academic/${oldCategory})`);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run migration if called directly
if (require.main === module) {
    migrateActivityCategories();
}

module.exports = migrateActivityCategories;