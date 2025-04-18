import { supabase } from './supabase';

/**
 * Upload an image to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name (defaults to 'products')
 * @param folder The folder path within the bucket (defaults to 'product-images')
 * @returns URL of the uploaded image or null on failure
 */
export async function uploadImage(
  file: File, 
  bucket: string = 'products',
  folder: string = 'product-images'
): Promise<string | null> {
  try {
    if (!file) return null;
    
    // Generate a unique filename to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL of the uploaded file
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param url The full URL of the image to delete
 * @param bucket The storage bucket name (defaults to 'products')
 * @returns Boolean indicating success or failure
 */
export async function deleteImage(
  url: string,
  bucket: string = 'products'
): Promise<boolean> {
  try {
    if (!url) return false;
    
    // Extract the file path from the URL
    // URL format is like: https://fqyaxeyfusrshzlwnhec.supabase.co/storage/v1/object/public/products/product-images/filename.jpg
    const urlParts = url.split(`/public/${bucket}/`);
    if (urlParts.length !== 2) return false;
    
    const filePath = urlParts[1];
    
    // Delete the file from storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Create a Supabase storage bucket if it doesn't exist
 * @param bucketName Name of the bucket to create
 * @param isPublic Whether the bucket should be publicly accessible
 * @returns Boolean indicating success or failure
 */
export async function createBucketIfNotExists(
  bucketName: string = 'products',
  isPublic: boolean = true
): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 5242880, // 5MB in bytes
      });
      
      if (error) throw error;
      console.log(`Storage bucket '${bucketName}' created successfully`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating storage bucket:', error);
    return false;
  }
} 