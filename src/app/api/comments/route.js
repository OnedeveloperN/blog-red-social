import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function POST(req) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ message: 'Debes iniciar sesión para comentar.' }, { status: 401 });
        }

        await connectDB();
        const { content, postId } = await req.json();

        if (!content || !postId) {
            return NextResponse.json({ message: 'El comentario y el ID del post son requeridos.' }, { status: 400 });
        }

        const newComment = new Comment({
            content,
            post: postId,
            author: user.id
        });

        await newComment.save();
        await newComment.populate('author', 'username');

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}