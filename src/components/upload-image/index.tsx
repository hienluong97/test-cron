import { useEffect, useState } from 'react'
import { supabaseClient } from '../../utility/supabase-client'
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from 'next/image'


type ImageProps = {
    url?: any,
    size: {
        width: number,
        height: number,
    }
    onUpload: (filePath: string) => void
}

export default function UploadImage({ url, size, onUpload }: ImageProps) {
    const [imageUrl, setImageUrl] = useState('')
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (url) handleDownloadImage(url)
    }, [url])

    async function handleDownloadImage(path: string) {
        try {
            const { data, error } = await supabaseClient.storage.from('subsidy').download(path)
            if (error) {
                throw error
            }
            const url = URL.createObjectURL(data)
            setImageUrl(url)
        } catch (error: any) {
            console.log('Error downloading image: ', error?.message)
        }
    }

    async function handleUploadImage(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabaseClient.storage
                .from('subsidy')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }
            onUpload(filePath)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    width={size?.width}
                    height={size?.height}
                    className=""
                    alt=""
                />
            ) : (
                <div
                    className="avatar no-image"
                    style={{ height: 10, width: 20 }}
                />
            )}
            <div style={{ width: 300 }}>
                <Button
                    size="small"
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    {uploading ? "アップロード中..." : "アップロード"}
                    <input
                        style={{
                            visibility: "hidden",
                            position: "absolute",
                        }}
                        type="file"
                        id="single"
                        name="img_cover"
                        accept="image/*"
                        onChange={handleUploadImage}
                        disabled={uploading}
                    />
                </Button>
            </div>
        </div>
    );
}