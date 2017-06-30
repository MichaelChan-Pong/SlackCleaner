const rp = require('request-promise');

rp({
    method:'POST',
    uri: 'https://slack.com/api/files.list',
    form: {
        token: process.env.TOKEN,
        count: 369
    }
})
    .then((res) => {
        let files = JSON.parse(res).files;
        console.log(files);
        setTimeout(() => {
            deleteFiles(files, 0);
        }, 1000);
    });

function deleteFiles (files, i) {
    rp({
        method: 'POST',
        uri: 'https://slack.com/api/files.delete',
        form: {
            token: process.env.TOKEN,
            file: files[i].id
        }
    })
        .then((res) => {
            console.log(res);
            if(i + 1 < files.length){
                setTimeout(() => {
                    deleteFiles(files, i + 1)
                }, 1000);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
