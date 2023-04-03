async function commentFormHandler(event) {
  event.preventDefault();
  const content = document.querySelector('textarea[name="comment-body"]').value.trim();
  const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];
  if (content) {
    const response = await fetch('/api/comments/edit', {
      method: 'POST',
      body: JSON.stringify({
        post_id,
        content
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
      document.querySelector('#comment-form').style.display = 'block';
    }
  }

}

document.getElementById('delete-comment-button').addEventListener('click', async (event) => {
  event.preventDefault();

  // Retrieve the comment ID from the data-id attribute
  const commentId = event.target.getAttribute('data-id');

  // Send a DELETE request to the route
  try {
    const response = await fetch(`/api/comment/delete/${commentId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the comment element from the DOM
      const commentElement = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
      commentElement.remove();

      console.log('Comment deleted!');
    } else {
      console.error('Failed to delete the comment.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
});


