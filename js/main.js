$('#dataTableUsers').DataTable();

const printUsers = async (usersList) => {
  $('#dataTableUsers').DataTable().clear().destroy();
  await $('.table-users').empty();
  await $.each(usersList, (key, value) => {
    $('.table-users').append(
      `
    <tr data-product-key="${value._id}>
      <th scope="row">${value.Usuario}</th>
      <td>${value.Usuario}</td>
      <td>${value.Password}</td>
      <td>${value.Nombre}</td>
      <td>${value.apPaterno} ${value.apMaterno}</td>
      <td>${value.Telefono}</td>
      <td style="text-align: center">
        <button class="btn btn-primary" onclick="getUserOne('${value._id}')">
          <i class="fas fa-edit"></i>
        </button>
      </td>
      <td style="text-align: center">
        <button class="btn btn-danger" onclick="deleteUser('${value._id}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
      `
    );
  });
  $(document).ready(function () {
    $('#dataTableUsers').DataTable();
  });
};

const getUsers = async () => {
  await $.ajax({
    url: 'https://crud-desarrollo-internet.herokuapp.com/api/usuarios',
    method: 'GET',
    success: (response) => {
      var data = JSON.stringify(response['users']);
      printUsers(JSON.parse(data));
    },
  });
};
getUsers();

const form = document.querySelector('#form_addUser');
const formUpdate = document.querySelector('#form_UpdateUser');

const addUser = async (FormData) => {
  const myData = {
    Usuario: FormData.get('Usuario'),
    Password: FormData.get('Password'),
    Nombre: FormData.get('Nombre'),
    apPaterno: FormData.get('apPaterno'),
    apMaterno: FormData.get('apMaterno'),
    Telefono: FormData.get('Telefono'),
  };

  fetch('https://crud-desarrollo-internet.herokuapp.com/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(myData),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert('Error inesperado');
      } else {
        // $('#dataTableUsers').DataTable();
        alert('Registrado correctamente!');
        $('#addUser').modal('hide');
        getUsers();
      }
    });
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  addUser(formData);
});

const editUser = (FormDat) => {
  const myData = {
    Usuario: FormDat.get('U_Usuario'),
    Password: FormDat.get('U_Password'),
    Nombre: FormDat.get('U_Nombre'),
    apPaterno: FormDat.get('U_apPaterno'),
    apMaterno: FormDat.get('U_apMaterno'),
    Telefono: FormDat.get('U_Telefono'),
  };

  var id = $('#idUser').val();
  var ruta = 'https://crud-desarrollo-internet.herokuapp.com/api/usuarios/' + id;

  fetch(ruta, {
    method: 'PUT',
    body: JSON.stringify(myData),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.error) {
        alert('Error inesperado');
      } else {
        // $('#dataTableUsers').DataTable();
        alert('Se actualizo correctamente!');
        $('#updateUser').modal('hide');
        getUsers();
      }
    });
};

formUpdate.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(formUpdate);
  editUser(formData);
});

const getUserOne = async (id) => {
  await $.ajax({
    url: 'https://crud-desarrollo-internet.herokuapp.com/api/usuarios/' + id,
    method: 'GET',
    success: (response) => {
      var data = JSON.stringify(response['users']);
      var dato = JSON.parse(data);
      $('#updateUser').modal('show');
      $('#U_Nombre').val(dato[0].Nombre);
      $('#U_apPaterno').val(dato[0].apPaterno);
      $('#U_apMaterno').val(dato[0].apMaterno);
      $('#U_Telefono').val(dato[0].Telefono);
      $('#U_Usuario').val(dato[0].Usuario);
      $('#U_Password').val(dato[0].Password);
      $('#idUser').val(dato[0]._id);
    },
  });
};

const deleteUser = (id) => {
  const ruta = 'https://crud-desarrollo-internet.herokuapp.com/api/usuarios/' + id;
  $.ajax({
    url: ruta,
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
    success: (response) => {
      console.log(response);
      alert('Se elimino correctamente');
      getUsers();
    },
  });
};
