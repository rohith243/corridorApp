var markdown = require('markdown').markdown;
var dbcontent = function(data, key) {
    for (var item in data) {
        if (data[item].name === key) {
            if (data[item].type === 'md') {
                return markdown.toHTML(data[item].value);
            } else {
                return data[item].value;
            }
        }
    }
    return '';
};
module.exports = dbcontent;
