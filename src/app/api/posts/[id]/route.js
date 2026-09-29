import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const post = await Post.findById(id).populate('author', 'username');
        if (!post) {
            return NextResponse.json({ message: 'Publicación no encontrada.' }, { status: 404 });
        }

        const comments = await Comment.find({ post: id })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        return NextResponse.json({ post, comments });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ message: 'No autorizado.' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ message: 'Publicación no encontrada.' }, { status: 404 });
        }

        if (post.author.toString() !== user.id) {
            return NextResponse.json({ message: 'No tienes permisos para editar esta publicación.' }, { status: 403 });
        }

        const body = await req.json();
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        ).populate('author', 'username');

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ message: 'No autorizado.' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ message: 'Publicación no encontrada.' }, { status: 404 });
        }

        if (post.author.toString() !== user.id) {
            return NextResponse.json({ message: 'No tienes permisos para eliminar esta publicación.' }, { status: 403 });
        }

        await Comment.deleteMany({ post: id });
        await post.deleteOne();

        return NextResponse.json({ message: 'Publicación eliminada correctamente.' });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}