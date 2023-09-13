
async function reactVerify(target, msg) {
    const filter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === target.id;
    };
    msg.awaitReactions({ filter, max: 1 })
        .then(collected => {
            const reaction = collected.first();
            if(reaction.emoji.name == '✅') {
                console.log("yes")
            }
            else {
                console.log("no")
            }
        })
}

module.exports = { reactVerify };