document.getElementById('edit-comment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const commentId = window.location.pathname.split('/').pop();
    const content = document.getElementById('content').value.trim();
    try {
        const response = await fetch(`/api/comment/edit/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({ content }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 403) {
            alert('Failed to update post: You do not have permission to edit this comment');
            return;
        }

        if (!response.ok) {
            alert('Failed to update post');
            return;
        }

        document.location.replace('/'); // Redirect to the desired page after successful update

    } catch (error) {
        console.error(error);
        alert('Failed to update post');
    }
});
