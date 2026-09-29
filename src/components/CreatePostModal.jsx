'use client';

import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

export default function CreatePostModal({ isOpen, onClose, onPostSaved, postToEdit = null, token }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (postToEdit) {
            setTitle(postToEdit.title || '');
            setContent(postToEdit.content || '');
            setImage(postToEdit.image || '');
        } else {
            setTitle('');
            setContent('');
            setImage('');
        }
        setError('');
    }, [postToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title || !content || !image) {
            setError('El título, el contenido y la imagen son obligatorios.');
            return;
        }

        try {
            setLoading(true);
            const isEditing = Boolean(postToEdit);
            const url = isEditing ? `/api/posts/${postToEdit._id}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, image })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error al guardar la publicación.');
            }

            onPostSaved(data, isEditing);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-slate-100">
                        {postToEdit ? 'Editar Publicación' : 'Crear Nueva Publicación'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                            Título
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="¿De qué trata tu publicación?"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                            Contenido
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Escribe el cuerpo de la publicación..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                        />
                    </div>

                    <ImageUploader onImageSelected={setImage} currentImage={image} />

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-5 py-2 rounded-lg text-sm transition shadow-lg shadow-cyan-950/50 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : postToEdit ? 'Actualizar' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}