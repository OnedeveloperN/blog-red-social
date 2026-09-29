'use client';

import { useState } from 'react';

export default function ImageUploader({ onImageSelected, currentImage }) {
    const [preview, setPreview] = useState(currentImage || '');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');

        if (!file) return;

        // Validación: debe ser una imagen
        if (!file.type.startsWith('image/')) {
            setError('Por favor, selecciona un archivo de imagen válido (JPG, PNG, WebP).');
            return;
        }

        // Validación de tamaño (Límite sugerido: 4MB para no recargar MongoDB)
        if (file.size > 4 * 1024 * 1024) {
            setError('La imagen es demasiado grande. El límite es de 4MB.');
            return;
        }

        // Convertir a Base64 con FileReader
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            const base64String = reader.result;
            setPreview(base64String);
            onImageSelected(base64String); // Enviar el resultado al componente padre
        };

        reader.onerror = () => {
            setError('Ocurrió un error al procesar la imagen.');
        };
    };

    const handleRemoveImage = () => {
        setPreview('');
        onImageSelected('');
    };

    return (
        <div className="w-full space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Imagen de la publicación <span className="text-red-400">*</span>
            </label>

            {error && (
                <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/30">
                    {error}
                </p>
            )}

            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-h-64 flex items-center justify-center">
                    <img
                        src={preview}
                        alt="Vista previa"
                        className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm transition shadow-lg"
                    >
                        Cambiar imagen
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-900/50 transition duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="text-3xl mb-2">🖼️</span>
                        <p className="mb-1 text-sm text-slate-300 font-medium">
                            Haz clic para subir una imagen
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, WEBP (Máx. 4MB)</p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}