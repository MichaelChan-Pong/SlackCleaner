const rp = require('request-promise');

rp({
    method:'POST',
    uri: 'https://slack.com/api/channels.list',
    form: {
        token: process.env.TOKEN,
        exclude_archived: false
    }
})
    .then((res) => {
        let channels = JSON.parse(res).channels;
        console.log(channels);
        for(i in channels){
            setTimeout(() => {
                deleteChannel(channels[i].id, 1);
            }, 1000);
        }
    });

function deleteChannel (channel, chunk) {
    rp({
        method: 'POST',
        uri: 'https://slack.com/api/channels.history',
        form: {
            token: process.env.TOKEN,
            channel: channel,
            inclusive: true,
            count: chunk,
            unreads: true
        }
    })
        .then((res) => {
            let messages = JSON.parse(res).messages;
            // console.log(messages);
            if(messages) {
                if (messages.length === chunk){
                    setTimeout(() => {
                        deleteChannel(channel, chunk);
                    }, 1000);
                }
            }
            for(i in messages){
                // console.log(messages[i]);
                let opts = {
                            method: 'POST',
                            uri: 'https://slack.com/api/chat.delete',
                            form: {
                                token: process.env.TOKEN,
                                ts: messages[i].ts,
                                channel: channel,
                                as_user: false
                            }
                        }
                        // console.log(opts);
                        rp(opts)
                            .then((res) => {
                                console.log(res);
                            })
                            .catch((err) => {
                                console.log(err)
                            });

            }
        })
        .catch((err) => {
            console.log(err);
        });
}
