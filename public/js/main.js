window.onload = () => {
    let editButtons = document.querySelectorAll('.edit-tweet');
    if (editButtons) {
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                let tweetData
                if (e.target.tagName === 'path') {
                    tweetData = e.target.parentElement.parentElement.previousElementSibling;
                } else {
                    tweetData = e.target.parentElement.previousElementSibling;
                }

                let textArea = document.querySelector('#edit-tweet-text-area');
                textArea.setAttribute('data-tweetid', tweetData.dataset.tweetid);
                textArea.innerText = tweetData.dataset.text;

                $('#editTweetModal').modal('show');
            });
        });
    }

    let finishEdit = document.querySelector('#finish-edit');
    if (finishEdit) {
        finishEdit.addEventListener('click', () => {
            let tweetData = {
                tweetID: document.querySelector('#edit-tweet-text-area').dataset.tweetid,
                text: document.querySelector('#edit-tweet-text-area').value
            }

            let httpRequest = new XMLHttpRequest();
            httpRequest.open('PUT', `/tweets/${tweetData.tweetid}`, true);
            httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            httpRequest.send(JSON.stringify(tweetData));

            location.reload();
        });
    }
}