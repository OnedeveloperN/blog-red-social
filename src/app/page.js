'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PostCard from '@/components/PostCard';
import CreatePostModal from '@/components/CreatePostModal';

export default function HomePage() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState('');

  // Estados para controlar el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);

  // Obtener todas las publicaciones con sus comentarios
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Error al obtener las publicaciones');
      const data = await res.json();

      // Cargar los comentarios de cada post individualmente
      const postsWithComments = await Promise.all(
        data.map(async (post) => {
          try {
            const commentRes = await fetch(`/api/posts/${post._id}`);
            if (commentRes.ok) {
              const detail = await commentRes.json();
              return { ...post, comments: detail.comments || [] };
            }
          } catch (e) {
            // Si falla la petición individual, devolvemos el post con array vacío
          }
          return { ...post, comments: [] };
        })
      );

      setPosts(postsWithComments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Controladores del Modal
  const handleOpenCreateModal = () => {
    setPostToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setPostToEdit(post);
    setIsModalOpen(true);
  };

  const handlePostSaved = (savedPost, isEditing) => {
    if (isEditing) {
      setPosts(posts.map((p) => (p._id === savedPost._id ? { ...savedPost, comments: p.comments } : p)));
    } else {
      setPosts([{ ...savedPost, comments: [] }, ...posts]);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al eliminar');
      }

      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-4">
      {/* Banner / Encabezado principal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Publicaciones recientes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Explora las novedades o comparte lo que piensas con la comunidad.
          </p>
        </div>

        {user && (
          <button
            onClick={handleOpenCreateModal}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-950/50 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <span>✨</span> Nueva publicación
          </button>
        )}
      </div>

      {/* Indicador de carga */}
      {loadingPosts && (
        <div className="text-center py-12 space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Cargando publicaciones...</p>
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Lista vacía */}
      {!loadingPosts && posts.length === 0 && !error && (
        <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <p className="text-slate-400 text-sm font-medium">No hay publicaciones disponibles.</p>
          {user && (
            <p className="text-xs text-slate-600 mt-1">
              ¡Sé el primero en compartir algo usando el botón de arriba!
            </p>
          )}
        </div>
      )}

      {/* Feed de publicaciones */}
      {!loadingPosts && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              token={token}
              onEdit={handleOpenEditModal}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear y Editar */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostSaved={handlePostSaved}
        postToEdit={postToEdit}
        token={token}
      />
    </div>
  );
}