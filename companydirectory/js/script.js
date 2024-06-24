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
  var frag = document.createDocumentFragment();
         
  data.forEach(function(item, index) {
    
    var row = document.createElement("tr");
               
    var name = document.createElement("td");
    name.classList = "fw-bold";
    name.setAttribute("data-id", item.lastName + "," + item.firstName)
    
    var name_Text = document.createTextNode(item.lastName + "," + item.firstName);
    name.append(name_Text);
    
    row.append(name);
    
    var department = document.createElement("td");
    var departmentText = document.createTextNode(item.department);
    department.append(departmentText);
    
    row.append(department);

    var jobTitle = document.createElement("td");
    var jobTitleText = document.createTextNode(item.jobTitle);
    jobTitle.append(jobTitleText);
    
    row.append(jobTitle);

    var location = document.createElement("td");
    var locationText = document.createTextNode(item.location);
    location.append(locationText);
    
    row.append(location);

    var email = document.createElement("td");
    var emailText = document.createTextNode(item.email);
    email.append(emailText);
    
    row.append(email);  
    
    var cell = document.createElement("td");
    cell.classList = "text-end text-nowrap";

    var editButton = document.createElement("BUTTON");
    editButton.classList = "btn btn-primary btn-sm";
    editButton.setAttribute("type","button");
    editButton.setAttribute("style","margin-right: 16px");
    editButton.setAttribute("data-bs-toggle","modal");
    editButton.setAttribute("data-bs-target","#editPersonnelModal");
    editButton.setAttribute("data-id",item.id);


    var edit_i = document.createElement("i");
    edit_i.classList = "fa-solid fa-pencil fa-fw";

    editButton.append(edit_i);
    
    cell.append(editButton);

    var deleteButton = document.createElement("BUTTON");
    deleteButton.classList = "btn btn-primary btn-sm";
    deleteButton.setAttribute("data-bs-toggle","modal");
    deleteButton.setAttribute("data-bs-target","#deletePersonnelModal");
    deleteButton.setAttribute("data-id",item.id);


    var delete_i = document.createElement("i");
    delete_i.classList = "fa-solid fa-trash fa-fw";

    deleteButton.append(delete_i);

    cell.append(deleteButton);
    
    row.append(cell);
              
    frag.append(row);

  });                
           
  $('#personnelTableBody').empty().append(frag);
}

function DepartmentTableBody(data){
  var frag = document.createDocumentFragment();
         
  data.forEach(function(item, index) {
    
    var row = document.createElement("tr");
               
    var department = document.createElement("td");
    department.classList = "fw-bold";
    department.setAttribute("data-id", item.department)
    
    var department_Text = document.createTextNode(item.department);
    department.append(department_Text);
    
    row.append(department);

    var location = document.createElement("td");
    var locationText = document.createTextNode(item.location);
    location.append(locationText);
    
    row.append(location);

    var cell = document.createElement("td");
    cell.classList = "text-end text-nowrap";

    var editButton = document.createElement("BUTTON");
    editButton.classList = "btn btn-primary btn-sm";
    editButton.setAttribute("type","button");
    editButton.setAttribute("style","margin-right: 16px");
    editButton.setAttribute("data-bs-toggle","modal");
    editButton.setAttribute("data-bs-target","#editDepartmentModal");
    editButton.setAttribute("data-id",item.id);


    var edit_i = document.createElement("i");
    edit_i.classList = "fa-solid fa-pencil fa-fw";

    editButton.append(edit_i);
    
    cell.append(editButton);

    var deleteButton = document.createElement("BUTTON");
    deleteButton.classList = "btn btn-primary btn-sm";
    deleteButton.setAttribute("data-bs-toggle","modal");
    deleteButton.setAttribute("data-bs-target","#deleteDepartmentModal");
    deleteButton.setAttribute("data-id",item.id);


    var delete_i = document.createElement("i");
    delete_i.classList = "fa-solid fa-trash fa-fw";

    deleteButton.append(delete_i);

    cell.append(deleteButton);
    
    row.append(cell);        
              
    frag.append(row);

  });                
           
  $('#departmentTableBody').empty().append(frag);

}

function LocationTableBody(data){
  var frag = document.createDocumentFragment();
         
  data.forEach(function(item, index) {
    
    var row = document.createElement("tr");
               
    var name = document.createElement("td");
    name.classList = "fw-bold";
    name.setAttribute("data-id", item.name)
    
    var name_Text = document.createTextNode(item.name);
    name.append(name_Text);
    
    row.append(name);

    var cell = document.createElement("td");
    cell.classList = "text-end text-nowrap";

    var editButton = document.createElement("BUTTON");
    editButton.classList = "btn btn-primary btn-sm";
    editButton.setAttribute("type","button");
    editButton.setAttribute("style","margin-right: 16px");
    editButton.setAttribute("data-bs-toggle","modal");
    editButton.setAttribute("data-bs-target","#editLocationModal");
    editButton.setAttribute("data-id",item.id);


    var edit_i = document.createElement("i");
    edit_i.classList = "fa-solid fa-pencil fa-fw";

    editButton.append(edit_i);
    
    cell.append(editButton);

    var deleteButton = document.createElement("BUTTON");
    deleteButton.classList = "btn btn-primary btn-sm";
    deleteButton.setAttribute("data-bs-toggle","modal");
    deleteButton.setAttribute("data-bs-target","#deleteLocationModal");
    deleteButton.setAttribute("data-id",item.id);


    var delete_i = document.createElement("i");
    delete_i.classList = "fa-solid fa-trash fa-fw";

    deleteButton.append(delete_i);

    cell.append(deleteButton);
    
    row.append(cell);     
              
    frag.append(row);

  });                
           
  $('#locationTableBody').empty().append(frag);
}


function showFilterPersonnelModal () {

  $.ajax({
    url:
      "./php/getAllDepartmentsAndLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {

      var statusCode = result.status.code;
      if (statusCode == 200) {
        result.data.department.forEach(function (item) 
          {
            $("#filterPersonnelDepartment").append(
              $("<option>", {
                value: item.id,
                text: item.department
              })
            );
          });
          result.data.location.forEach(function (item) 
          {
            $("#filterPersonnelLocation").append(
              $("<option>", {
                value: item.id,
                text: item.name
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

$("#filterPersonnelDepartment").change(function () {
  
  if (this.value > 0) {
    
    $("#filterPersonnelLocation").val(0);
    
    let departmentID = document.getElementById("filterPersonnelDepartment");
    let locationID = document.getElementById("filterPersonnelLocation");
   
    $.ajax({
        url:
          "./php/filterPersonnels.php",
        type: "POST",
        dataType: "json",
        data: {
          locationID: locationID.value,
          departmentID: departmentID.value 
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
})

$("#filterPersonnelLocation").change(function () {

  if (this.value > 0) {
    
    $("#filterPersonnelDepartment").val(0);
    
    let departmentID = document.getElementById("filterPersonnelDepartment");
    let locationID = document.getElementById("filterPersonnelLocation");
   
    $.ajax({
        url:
          "./php/filterPersonnels.php",
        type: "POST",
        dataType: "json",
        data: {
          locationID: locationID.value,
          departmentID: departmentID.value 
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
})

$("#filterDepartmentLocation").change(function () {
  
  let locationID = document.getElementById("filterDepartmentLocation");
 
  $.ajax({
      url:
        "./php/filterDepartments.php",
      type: "POST",
      dataType: "json",
      data: {
        locationID: locationID.value 
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
})


