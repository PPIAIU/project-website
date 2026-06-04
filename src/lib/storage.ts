import { supabase } from './supabase';

/**
 * Upload file to Supabase Storage
 * @param file - File object to upload
 * @param bucket - Bucket name (member-photos, blog-images, documents)
 * @param folder - Optional folder path within bucket
 * @returns Public URL of uploaded file or null if error
 */
export async function uploadFile(
  file: File,
  bucket: 'member-photos' | 'blog-images' | 'documents',
  folder?: string
): Promise<string | null> {
  try {
    // Validate file
    if (!file.type.startsWith('image/') && bucket !== 'documents') {
      console.error('File must be an image');
      return null;
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}

/**
 * Delete file from Supabase Storage
 * @param url - Public URL of file to delete
 * @param bucket - Bucket name
 * @returns true if successful, false otherwise
 */
export async function deleteFile(
  url: string,
  bucket: 'member-photos' | 'blog-images' | 'documents'
): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.indexOf(bucket);
    if (bucketIndex === -1) {
      console.error('Invalid URL format');
      return false;
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}
