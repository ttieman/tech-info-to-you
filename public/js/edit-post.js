async function updatePost(event) {
  event.preventDefault();

  const postId = window.location.pathname.split('/')[3];
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to update post');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to update post');
  }
}
async function deletePost(postId) { //http://localhost:3001/api/posts/:id
  try {

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete post');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to delete post');
  }
}

document.getElementById('edit-post-form').addEventListener('submit', updatePost);