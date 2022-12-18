module.exports = {

    showError: function (errors, field) {
        var error = "";
        Object.keys(errors).forEach(function(index) {
            if (errors[index][field]) {
                error = errors[index][field];
            }
        });
        return error;
    },

}