import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User'; // Necesario para el .populate()
import { getAuthUser } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ message: 'No autorizado. Token inválido o ausente.' }, { status: 401 });
        }

        await connectDB();
        const { title, content, image } = await req.json();

        if (!title || !content || !image) {
            return NextResponse.json({ message: 'Título, contenido e imagen (Base64) son obligatorios.' }, { status: 400 });
        }

        const newPost = new Post({
            title,
            content,
            image,
            author: user.id
        });

        await newPost.save();
        await newPost.populate('author', 'username');

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}