module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setActivity({type: 'WATCHING', name:'the world burn'});
		console.log(`Ready! Logged in as ${client.user.tag}`);
	}
};