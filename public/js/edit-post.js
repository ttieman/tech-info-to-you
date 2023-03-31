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
  
  document.getElementById('edit-post-form').addEventListener('submit', updatePost);