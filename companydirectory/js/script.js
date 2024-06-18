window.onload = function() {
  GetAllPersonnel ();
};

$("#searchInp").on("keyup", function () {
  var $field = $(this);
  if ($("#personnelBtn").hasClass("active")) {
      
    SearchPersonnels ($field.val());
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      SearchDepartments($field.val());
      
    } else {
      
      SearchLocations($field.val());
      
    }
    
  }
  });
  
  $("#refreshBtn").click(function () {
    document.getElementById("searchInp").value = "";
    if ($("#personnelBtn").hasClass("active")) {
      
      GetAllPersonnel ();
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        GetAllDepartments();
        
      } else {
        
        GetAllLocations();
        
      }
      
    }
    
  });
  
  $("#filterBtn").click(function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      showFilterPersonnelModal ();
      
    
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        showFilterDepartmentModal();
       
        
      } else {
        $('#filterLocationModal').modal('show');
       
        
      }
    }
    
  });
  
  $("#addBtn").click(function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      showInsertPersonnelModal ();
      
    
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        showInsertDepartmentModal();
       
        
      } else {
        $('#insertLocationModal').modal('show');
       
        
      }
    }
    
  });
  
  $("#personnelBtn").click(function () {

    
    GetAllPersonnel ();
    
  });
  
  $("#departmentsBtn").click(function () {
    
    GetAllDepartments();
    
  });
  
  $("#locationsBtn").click(function () {
    
    GetAllLocations();
    
  });
  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    GetPersonnelByID (e);
  
  });

  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    GetDepartmentByID (e);
  
  });

  $("#editLocationModal").on("show.bs.modal", function (e) {
    GetLocationByID (e);
  
  });

  $("#deletePersonnelModal").on("show.bs.modal", function (e) {
    $("#deletePersonnelEmployeeID").val($(e.relatedTarget).attr("data-id"));
    $.ajax({
      url:
        "./php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
        if (resultCode == 200) {
          $("#areYouSurePersonnelName").text(
            result.data.personnel[0].firstName +
              " " +
              result.data.personnel[0].lastName
          );
          
        } else {
          $("#deletePersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        $("#deletePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });

  $("#deleteDepartmentModal").on("show.bs.modal", function (e) {
    $("#deleteDepartmentID").val($(e.relatedTarget).attr("data-id"));
    $.ajax({
      url:
        "./php/checkDepartmentToBeDeleted.php",
      type: "POST",
      dataType: "json",
      data: {
        departmentID: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
        if (resultCode == 200) {
          const div = document.getElementById("tryDeleteDepartment");
          if (result.data[0].personnelCount == 0) {
            div.innerHTML ="Are you sure that you want to remove the entry for <span class='fw-bold'>" + result.data[0].departmentName + "</span>?";
            document.getElementById("deleteDepartmentBtn").disabled = false;
          } else {
            div.innerHTML = "You cannot remove the entry for <span class='fw-bold'>" + result.data[0].departmentName +"</span> because it has <span class='fw-bold'>"+ result.data[0].personnelCount + "</span> employees assigned to it.";
            document.getElementById("deleteDepartmentBtn").disabled = true;
          }
        } else {
          $("#deleteDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        $("#deleteDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });

  $("#deleteLocationModal").on("show.bs.modal", function (e) {
    $("#deleteLocationID").val($(e.relatedTarget).attr("data-id"));
    $.ajax({
      url:
        "./php/checkLocationToBeDeleted.php",
      type: "POST",
      dataType: "json",
      data: {
        locationID: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
        if (resultCode == 200) {
          const div = document.getElementById("tryDeleteLocation");
          if (result.data[0].departmentCount == 0) {
            div.innerHTML = "Are you sure that you want to remove the entry for <span class='fw-bold'>" + result.data[0].locationName + "</span>?";
            document.getElementById("deleteLocationBtn").disabled = false;
          } else {
            div.innerHTML = "You cannot remove the entry for <span class='fw-bold'>" + result.data[0].locationName +"</span> because it has <span class='fw-bold'>"+ result.data[0].departmentCount + "</span> departments assigned to it.";
            document.getElementById("deleteLocationBtn").disabled = true;
          }
        } else {
          $("#deleteLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        $("#deleteLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  

  // Executes when the form button with type="submit" is clicked
  
  $("#editPersonnelForm").on("submit", function (e) {
    
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour
  
    e.preventDefault();
  
    // AJAX call to save form data
    
  });

  // GetAll
  function GetAllPersonnel () {

    $.ajax({
      url:
        "./php/getAll.php",
      type: "POST",
      dataType: "json",
      success: function (result) {

        var statusCode = result.status.code;
        if (statusCode == 200) {
          PersonnelTableBody(result.data);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });


  }  

  function GetAllDepartments () {

    $.ajax({
      url:
        "./php/getAllDepartments.php",
      type: "POST",
      dataType: "json",
      success: function (result) {

        var statusCode = result.status.code;
        if (statusCode == 200) {
          DepartmentTableBody(result.data);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });


  }  

  function GetAllLocations () {

    $.ajax({
      url:
        "./php/getAllLocations.php",
      type: "POST",
      dataType: "json",
      success: function (result) {

        var statusCode = result.status.code;
        if (statusCode == 200) {
          LocationTableBody(result.data);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });


  }  


//GetById
  function GetPersonnelByID (e) {

    $.ajax({
      url:
        "./php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });


  }

  function GetDepartmentByID (e) {

    $.ajax({
      url:
        "./php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {


          $("#editDepartmentID").val(result.data.department[0].id);
  
          $("#editDepartmentName").val(result.data.department[0].Name);
          $("#editDepartmentLocation").html("");
  
          $.each(result.data.location, function () {
            $("#editDepartmentLocation").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editDepartmentLocation").val(result.data.department[0].locationID);
          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });


  }

  function GetLocationByID (e) {

    $.ajax({
      url:
        "./php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {


          $("#editLocationID").val(result.data[0].id);
  
          $("#editLocation").val(result.data[0].Name);
          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });


  }

  document.getElementById("editPersonnelForm").addEventListener("submit", (e) => {
    e.preventDefault();
  
    let firstName = document.getElementById("editPersonnelFirstName");
    let lastName = document.getElementById("editPersonnelLastName");
    let jobTitle = document.getElementById("editPersonnelJobTitle");
    let email = document.getElementById("editPersonnelEmailAddress");
    let personnelID = document.getElementById("editPersonnelEmployeeID");
    let departmentID = document.getElementById("editPersonnelDepartment");
  
    if (firstName.value == "" || lastName.value == "" ||  jobTitle.value == "" || email.value == "" || departmentID.value == "" || personnelID.value == "") {
      alert("Ensure you input a value in fields!");
    } else { 
      $.ajax({
        url:
          "./php/updatePersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
          id: personnelID.value,
          firstName: firstName.value, 
          lastName: lastName.value,
          jobTitle: jobTitle.value,
          email: email.value,
          departmentID: departmentID.value 
        },
        success: function (result) {
          var resultCode = result.status.code;
    
          if (resultCode == 200) {
  
            $('#editPersonnelModal').modal('hide');
            GetAllPersonnel();
  
            
          } else {
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
      
        }
      });
  
    }
  });




  document.getElementById("editDepartmentsForm").addEventListener("submit", (e) => {
    e.preventDefault();
  
    let name = document.getElementById("editDepartmentName");
    let departmentID = document.getElementById("editDepartmentID");
    let locationID = document.getElementById("editDepartmentLocation");
  
    if (name.value == ""  || departmentID.value == "" || locationID.value == "") {
      alert("Ensure you input a value in fields!");
    } else { 
      $.ajax({
        url:
          "./php/updateDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
          id: departmentID.value,
          name: name.value, 
          locationID: locationID.value 
        },
        success: function (result) {
          var resultCode = result.status.code;
    
          if (resultCode == 200) {
  
            $('#editDepartmentModal').modal('hide');
            GetAllDepartments();
  
            
          } else {
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
      
        }
      });
  
    }
  });


document.getElementById("editLocationForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let name = document.getElementById("editLocation");
  let locationID = document.getElementById("editLocationID");

  if (name.value == ""  || locationID.value == "") {
    alert("Ensure you input a value in fields!");
  } else { 
    $.ajax({
      url:
        "./php/updateLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        id: locationID.value,
        name: name.value 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {

          $('#editLocationModal').modal('hide');
          GetAllLocations();

          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });

  }
});



document.getElementById("deletePersonnelForm").addEventListener("submit", (e) => {
  e.preventDefault();

 
  let personnelID = document.getElementById("deletePersonnelEmployeeID");


  if (personnelID.value == "") {
    alert("Ensure you input a value in fields!");
  } else { 
    $.ajax({
      url:
        "./php/deletePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: personnelID.value 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {

          $('#deletePersonnelModal').modal('hide');
          GetAllPersonnel();

          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });

  }
});

document.getElementById("deleteDepartmentForm").addEventListener("submit", (e) => {
  e.preventDefault();

 
  let departmentID = document.getElementById("deleteDepartmentID");


  if (departmentID.value == "") {
    alert("Ensure you input a value in fields!");
  } else { 
    $.ajax({
      url:
        "./php/deleteDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: departmentID.value
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
  
          $('#deleteDepartmentModal').modal('hide');
          GetAllDepartments();
  
          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });
  }
});

document.getElementById("deleteLocationForm").addEventListener("submit", (e) => {
  e.preventDefault();

 
  let locationID = document.getElementById("deleteLocationID");


  if (locationID.value == "") {
    alert("Ensure you input a value in fields!");
  } else { 
    $.ajax({
      url:
        "./php/deleteLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: locationID.value 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
  
          $('#deleteLocationModal').modal('hide');
          GetAllLocations();
  
          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });
  }
});

function showInsertPersonnelModal () {

  $.ajax({
    url:
      "./php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {

      var statusCode = result.status.code;
      if (statusCode == 200) {
        result.data.forEach(function (item) 
          {
            $("#insertPersonnelDepartment").append(
              $("<option>", {
                value: item.id,
                text: item.department
              })
            );
          });

          $('#insertPersonnelModal').modal('show');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}

function showInsertDepartmentModal () {

  $.ajax({
    url:
      "./php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {

      var statusCode = result.status.code;
      if (statusCode == 200) {
        result.data.forEach(function (item) 
          {
            $("#insertDepartmentLocation").append(
              $("<option>", {
                value: item.id,
                text: item.name
              })
            );
          });

          $('#insertDepartmentModal').modal('show');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}


document.getElementById("insertPersonnelForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let firstName = document.getElementById("insertPersonnelFirstName");
  let lastName = document.getElementById("insertPersonnelLastName");
  let jobTitle = document.getElementById("insertPersonnelJobTitle");
  let email = document.getElementById("insertPersonnelEmailAddress");
  let departmentID = document.getElementById("insertPersonnelDepartment");

  if (firstName.value == "" || jobTitle.value == "" || lastName.value == "" || email.value == "" || departmentID.value == "") {
    alert("Ensure you input a value in fields!");
  } else { 
    $.ajax({
      url:
        "./php/insertPersonnel.php",
      type: "POST",
      dataType: "json",
      data: {
        firstName: firstName.value, 
        lastName: lastName.value,
        jobTitle: jobTitle.value,
        email: email.value,
        departmentID: departmentID.value 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {

          $('#insertPersonnelModal').modal('hide');
          GetAllPersonnel();

          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });

  }
});


document.getElementById("insertDepartmentsForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let name = document.getElementById("insertDepartmentName");
  let locationID = document.getElementById("insertDepartmentLocation");

  if (name.value == ""  || locationID.value == "") {
    alert("Ensure you input a value in fields!");
  } else { 
    $.ajax({
      url:
        "./php/insertDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        name: name.value, 
        locationID: locationID.value 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {

          $('#insertDepartmentModal').modal('hide');
          GetAllDepartments();

          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });

  }
});


document.getElementById("insertLocationForm").addEventListener("submit", (e) => {
  e.preventDefault();

let name = document.getElementById("insertLocation");


if (name.value == "") {
  alert("Ensure you input a value in fields!");
} else { 
  $.ajax({
    url:
      "./php/insertLocation.php",
    type: "POST",
    dataType: "json",
    data: {
    
      name: name.value 
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {

        $('#insertLocationModal').modal('hide');
        GetAllLocations();

        
      } else {
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
  
    }
  });

}
});


function SearchPersonnels(text) {

  $.ajax({
    url:
      "./php/searchPersonnels.php",
    type: "POST",
    dataType: "json",
    data: {
      txt: text,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        PersonnelTableBody(result.data.found);
      } else {
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
  
    }
  });
}

function SearchDepartments(text) {

  $.ajax({
    url:
      "./php/searchDepartments.php",
    type: "POST",
    dataType: "json",
    data: {
      txt: text,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        DepartmentTableBody(result.data.found);
      } else {
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
  
    }
  });
}

function SearchLocations(text) {

  $.ajax({
    url:
      "./php/searchLocations.php",
    type: "POST",
    dataType: "json",
    data: {
      txt: text,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        LocationTableBody(result.data.found);
      } else {
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
  
    }
  });
}

function PersonnelTableBody(data){
  const tableBody = document.querySelector("#personnelTableBody");
  tableBody.innerHTML = "";
  data.forEach(function (item) 
  {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="align-middle text-nowrap">${item.lastName}, ${item.firstName}</td>
    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.department}</td>
    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.jobTitle}</td>
    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.location}</td>
    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.email}</td>
    <td class="text-end text-nowrap">
      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${item.id}">
        <i class="fa-solid fa-pencil fa-fw"></i>
      </button>
      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${item.id}">
        <i class="fa-solid fa-trash fa-fw"></i>
      </button>
    </td>`;
    tableBody.appendChild(row);
  });
}

function DepartmentTableBody(data){
  const tableBody = document.querySelector("#departmentTableBody");
  tableBody.innerHTML = "";
  data.forEach(function (item) 
  {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="align-middle text-nowrap">${item.department}</td>
    <td class="align-middle text-nowrap d-none d-md-table-cell">${item.location}</td>
    <td class="align-middle text-end text-nowrap">
      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${item.id}">
        <i class="fa-solid fa-pencil fa-fw"></i>
      </button>
      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${item.id}">
        <i class="fa-solid fa-trash fa-fw"></i>
      </button>
    </td>`;
    tableBody.appendChild(row);
  });
}

function LocationTableBody(data){
  const tableBody = document.querySelector("#locationTableBody");
  tableBody.innerHTML = "";
  data.forEach(function (item) 
  {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="align-middle text-nowrap">${item.name}</td>
    <td class="align-middle text-end text-nowrap">
      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${item.id}">
        <i class="fa-solid fa-pencil fa-fw"></i>
      </button>
      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${item.id}">
        <i class="fa-solid fa-trash fa-fw"></i>
      </button>
    </td>`;
    tableBody.appendChild(row);
  });
}


function showFilterPersonnelModal () {

  $.ajax({
    url:
      "./php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {

      var statusCode = result.status.code;
      if (statusCode == 200) {
        result.data.forEach(function (item) 
          {
            $("#filterPersonnelDepartment").append(
              $("<option>", {
                value: item.id,
                text: item.department
              })
            );
          });

          $('#filterPersonnelModal').modal('show');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
    }
  });
}

function showFilterDepartmentModal () {

  $.ajax({
    url:
      "./php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {

      var statusCode = result.status.code;
      if (statusCode == 200) {
        result.data.forEach(function (item) 
          {
            $("#filterDepartmentLocation").append(
              $("<option>", {
                value: item.id,
                text: item.name
              })
            );
          });

          $('#filterDepartmentModal').modal('show');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}

document.getElementById("filterPersonnelForm").addEventListener("submit", (e) => {
  e.preventDefault();

 
  let firstName = document.getElementById("filterPersonnelFirstName");
  let lastName = document.getElementById("filterPersonnelLastName");
  let jobTitle = document.getElementById("filterPersonnelJobTitle");
  let email = document.getElementById("filterPersonnelEmailAddress");
  let departmentID = document.getElementById("filterPersonnelDepartment");
 
  $.ajax({
      url:
        "./php/filterPersonnels.php",
      type: "POST",
      dataType: "json",
      data: {
        firstName: firstName.value, 
        lastName: lastName.value,
        jobTitle: jobTitle.value,
        email: email.value,
        departmentID: departmentID.value 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {

          $('#filterPersonnelModal').modal('hide');
          PersonnelTableBody(result.data.found);
          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });
});

document.getElementById("filterDepartmentsForm").addEventListener("submit", (e) => {
  e.preventDefault();

 
  let name = document.getElementById("filterDepartmentName");
  let locationID = document.getElementById("filterDepartmentLocation");
 
  $.ajax({
      url:
        "./php/filterDepartments.php",
      type: "POST",
      dataType: "json",
      data: {
        name: name.value, 
        locationID: locationID.value 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {

          $('#filterDepartmentModal').modal('hide');
          DepartmentTableBody(result.data.found);
          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });
});

document.getElementById("filterLocationForm").addEventListener("submit", (e) => {
  e.preventDefault();

 
  let name = document.getElementById("filterLocation");
 
  $.ajax({
      url:
        "./php/filterLocations.php",
      type: "POST",
      dataType: "json",
      data: {
        name: name.value 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {

          $('#filterLocationModal').modal('hide');
          LocationTableBody(result.data.found);
          
        } else {
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    
      }
    });
});


