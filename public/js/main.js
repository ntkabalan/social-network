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
            httpRequest.open('PUT', '/tweets/', true);
            httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            httpRequest.send(JSON.stringify(tweetData));

            location.reload();
        });
    }

    let deleteButtons = document.querySelectorAll('.delete-tweet');
    if (deleteButtons) {
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                let tweetData
                if (e.target.tagName === 'path') {
                    tweetData = e.target.parentElement.parentElement.previousElementSibling;
                } else {
                    tweetData = e.target.parentElement.previousElementSibling;
                }

                let tweetPreview = document.querySelector('#tweet-preview');
                tweetPreview.setAttribute('data-tweetid', tweetData.dataset.tweetid);
                tweetPreview.innerText = tweetData.dataset.text;

                $('#deleteTweetModal').modal('show');
            });
        });
    }

    let finishDelete = document.querySelector('#finish-delete');
    if (finishDelete) {
        finishDelete.addEventListener('click', () => {
            let tweetData = {
                tweetID: document.querySelector('#tweet-preview').dataset.tweetid
            }
            
            let httpRequest = new XMLHttpRequest();
            httpRequest.open('DELETE', '/tweets/', true);
            httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            httpRequest.send(JSON.stringify(tweetData));

            location.reload();
        });
    }

    let charCounter = document.querySelector('#char-count');
    if (charCounter) {
        charCounter.innerText = 140;
        let tweetBody = document.querySelector('#tweet-body');
        if (tweetBody) {
            tweetBody.addEventListener('input', () => {
                charCounter.innerText = 140 - tweetBody.value.length;

                if (parseInt(charCounter.innerText) < 0) {
                    charCounter.classList.add('text-danger');
                } else {
                    charCounter.classList.remove('text-danger');
                }
            });
        }
    }

    let favoriteButtons = document.querySelectorAll('.favorite');
    if (favoriteButtons) {
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                let httpRequest = new XMLHttpRequest();
                httpRequest.open('POST', '/tweets/favorite', true);
                httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                httpRequest.send(JSON.stringify({
                    test: 'Hello'
                }));

                httpRequest.onload = () => {
                    let res = httpRequest.responseText;
                    if (res) {
                        res = JSON.parse(res);
                        console.log(res);
                    }
                }
            });
        });
    }
}