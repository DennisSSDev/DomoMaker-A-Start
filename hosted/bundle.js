'use strict';

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#domoName').val() === '' || $('#domoAge').val() === '') {
        handleError('RAWR: all fields are required');
        return false;
    }

    sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
        loadDomosFromServer();
    });
};

var deleteDomo = function deleteDomo(e) {
    e.preventDefault();

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#delDomoName').val() === '') {
        handleError('RAWR: name is empty');
        return false;
    }

    sendAjax('POST', $('#delDomoForm').attr('action'), $('#delDomoForm').serialize(), function () {
        loadDomosFromServer();
    });
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            null,
            'Make Domos:'
        ),
        React.createElement(
            'form',
            { id: 'domoForm',
                name: 'domoForm',
                onSubmit: handleDomo,
                action: '/maker',
                method: 'POST',
                className: 'domoForm' },
            React.createElement(
                'label',
                { htmlFor: 'name' },
                'Name:'
            ),
            React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
            React.createElement(
                'label',
                { htmlFor: 'age' },
                'Age:'
            ),
            React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
            React.createElement(
                'label',
                { htmlFor: 'level' },
                'Level:'
            ),
            React.createElement('input', { id: 'domoAge', type: 'text', name: 'level', placeholder: 'Domo Level' }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
        )
    );
};

var DeleteDomoForm = function DeleteDomoForm(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            null,
            'Delete All Domos with Name:'
        ),
        React.createElement(
            'form',
            { id: 'delDomoForm',
                name: 'delDomoForm',
                onSubmit: deleteDomo,
                action: '/deleteDomo',
                method: 'POST',
                className: 'delDomoForm' },
            React.createElement(
                'label',
                { htmlFor: 'name' },
                'Name:'
            ),
            React.createElement('input', { id: 'delDomoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Delete Domo' })
        )
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            'div',
            { className: 'domoList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No Domos yet'
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            'div',
            { key: domo._id, className: 'domo' },
            React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
            React.createElement(
                'h3',
                { className: 'domoName' },
                ' Name: ',
                domo.name
            ),
            React.createElement(
                'h3',
                { className: 'domoAge' },
                ' Age: ',
                domo.age
            ),
            React.createElement(
                'h3',
                { className: 'domoAge' },
                ' Level: ',
                domo.level
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'domoList' },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax("GET", '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DeleteDomoForm, { csrf: csrf }), document.querySelector("#deleteDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(resp) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = resp.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
