const PrettyTable = require('prettytable');
module.exports = {
    exportHtml: (data) => {
        const pt = new PrettyTable();
        const headers = ["Link", "Price"];
        pt.create(headers, data);
        let html = `<pre>${pt.toString()}</pre>`
        return html;
    }
}