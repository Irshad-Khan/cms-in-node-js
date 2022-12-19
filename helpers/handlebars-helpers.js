const moment = require('moment');

module.exports = {
    /**
     * It return all options dynami. It search value and then add
     * selected attribute on found option
     * @param {*} selected 
     * @param {*} options 
     * @returns 
     */
    select: function (selected, options) {
        return options.fn(this)
            .replace(new RegExp('value=\"' + selected + '\"'),
                '$&selected="selected"');
    },
    formatIndex: function(index)  {
        return index+1;
    },
    generateTime: function (date, format) {
        return moment(date).format(format);
    }
}