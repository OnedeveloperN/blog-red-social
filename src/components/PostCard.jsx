'use client';

import { useState } from 'react';

export default function PostCard({ post, currentUser, token, onEdit, onDelete }) {
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [loadingComment, setLoadingComment] = useState(false);

    const isAuthor = currentUser && currentUser.id === post.author?._id;

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !token) return;

        try {
            setLoadingComment(true);
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: commentText, postId: post._id })
            });

            const newComment = await res.json();
            if (!res.ok) throw new Error(newComment.message);

            setComments([newComment, ...comments]);
            setCommentText('');
        } catch (err) {
            alert(err.message || 'Error al publicar comentario');
        } finally {
            setLoadingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('¿Eliminar este comentario?')) return;

        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Error al eliminar');

            setComments(comments.filter((c) => c._id !== commentId));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700/80 transition duration-200">
            {/* Cabecera del Post */}
            <div className="p-4 md:p-5 flex items-center justify-between border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-200 text-sm">
                            @{post.author?.username || 'usuario'}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>

                {/* Acciones del autor */}
                {isAuthor && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(post)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(post._id)}
                            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30 transition"
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>

            {/* Imagen del Post (Base64) */}
            <div className="w-full bg-slate-950 flex items-center justify-center max-h-96 overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full object-cover max-h-96"
                />
            </div>

            {/* Cuerpo del Post */}
            <div className="p-4 md:p-5 space-y-2">
                <h2 className="text-xl font-bold text-slate-100">{post.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {post.content}
                </p>

                {/* Contador y Toggle de Comentarios */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="hover:text-cyan-400 font-medium flex items-center gap-1 transition"
                    >
                        💬 {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
                    </button>
                </div>
            </div>

            {/* Sección desplegable de Comentarios */}
            {showComments && (
                <div className="bg-slate-950/60 border-t border-slate-800 p-4 space-y-4">
                    {/* Formulario para comentar (Solo si está autenticado) */}
                    {currentUser ? (
                        <form onSubmit={handleAddComment} className="flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                            />
                            <button
                                type="submit"
                                disabled={loadingComment || !commentText.trim()}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
                            >
                                Comentar
                            </button>
                        </form>
                    ) : (
                        <p className="text-xs text-slate-500 text-center py-1">
                            Inicia sesión para dejar un comentario.
                        </p>
                    )}

                    {/* Lista de Comentarios */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {comments.length === 0 ? (
                            <p className="text-xs text-slate-600 text-center py-2">
                                Aún no hay comentarios.
                            </p>
                        ) : (
                            comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-3 flex justify-between items-start gap-2"
                                >
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-cyan-400">
                                            @{comment.author?.username || 'usuario'}
                                        </span>
                                        <p className="text-xs text-slate-300">{comment.content}</p>
                                    </div>

                                    {currentUser && currentUser.id === comment.author?._id && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-slate-500 hover:text-red-400 text-xs px-1"
                                            title="Eliminar comentario"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}