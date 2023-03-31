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
  
  function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-post');
  
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const postId = event.target.dataset.id;
        deletePost(postId);
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    addDeleteEventListeners();
  });