module.exports = function(){
    // reset planet relay and allow new transmission
    console.log("=== EOT ===");
    lab._ls.forEach(p => {
        if (p.type === 'star') {
            p.executing = false
            p.sending = false
        }
    })
    lab.start.allowCommandReceiving = true;
};
