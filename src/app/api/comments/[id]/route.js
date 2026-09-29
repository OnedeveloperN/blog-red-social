import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Comment from '@/models/Comment';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(req, { params }) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ message: 'No autorizado.' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return NextResponse.json({ message: 'Comentario no encontrado.' }, { status: 404 });
        }

        if (comment.author.toString() !== user.id) {
            return NextResponse.json({ message: 'No tienes permiso para borrar este comentario.' }, { status: 403 });
        }

        await comment.deleteOne();
        return NextResponse.json({ message: 'Comentario eliminado.' });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}