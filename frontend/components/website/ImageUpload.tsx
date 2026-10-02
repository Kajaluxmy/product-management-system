'use client';

import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ImageUploadProps {
  existingImageUrl?: string;
  onImageChange: (file: File | null) => void;
}

export default function ImageUpload({
  existingImageUrl,
  onImageChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingImageUrl ?? null,
  );
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFileName(file.name);
    } else {
      setPreviewUrl(existingImageUrl ?? null);
      setFileName('');
    }

    onImageChange(file);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Product Image
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center' }}
      >
        <Button
          variant="outlined"
          component="label"
          role={undefined}
        >
          Choose Image
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {fileName && (
          <Typography variant="body2" color="text.secondary">
            {fileName}
          </Typography>
        )}
      </Stack>

      {previewUrl && (
        <Box
          component="img"
          src={previewUrl}
          alt="Product preview"
          sx={{
            width: '100%',
            maxWidth: 240,
            height: 180,
            objectFit: 'cover',
            borderRadius: 2,
            mt: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        />
      )}
    </Box>
  );
}
