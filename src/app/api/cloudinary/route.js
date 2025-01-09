import cloudinary from '@/lib/cloudinary';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { file } = req.body;

      // Upload file to Cloudinary
      const response = await cloudinary.uploader.upload(file, {
        folder: 'StudBud', // Optional: Specify a folder
      });

      res.status(200).json({ url: response.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
