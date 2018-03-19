const bachelorYear = 4;
const masterYear = 6;
let selectedElem = 0;

var View = function () {
  this.onClickNextStep = null;
  this.onClickPracticeCompleted = null;
  this.onClickCreatePractice = null;
  this.onClickToOrganisationsSection = null;
  this.onClickToStudentsSection = null;
  this.onClickFinishBtn = null;
  this.onClickSelectGroupBtnOk = null;
  this.myTable = $('#studentsListTable');
  this.onClickYearsArray = null;
  this.selectedYear = null;
  this.idTreeViews = [
    'group-treeview-tabcontrol1-bachelor',
    'group-treeview-tabcontrol2-master',
    'groups-treeview-practice-creation-bachelor',
    'groups-treeview-practice-creation-master'
  ];
  this.onClickGetOrganisations = null;
  this.onClickCreateOrganisation=null;
};

View.prototype.init = function () {
  document.getElementsByClassName("btn-next")[0].addEventListener('click',
      this.onClickNextStep);
  document.querySelector("#dialogPracticeCompleteSuccess").querySelector(
      "#practiceFinishedOk").addEventListener('click',
      this.onClickPracticeCompleted);
  document.getElementById("createPracticeBtn").addEventListener('click',
      this.onClickCreatePractice);
  document.getElementById("organisationsSectionBtn").addEventListener('click',
      this.onClickToOrganisationsSection);
  document.getElementById("studentsSectionBtn").addEventListener('click',
      this.onClickToStudentsSection);
  document.getElementsByClassName("btn-finish")[0].addEventListener('click',
      this.onClickFinishBtn);
  document.getElementById("getGroupsBtnOk").addEventListener('click',
      this.onClickSelectGroupBtnOk);
  document.getElementById("buttonsArray").addEventListener('click',
      this.onClickYearsArray);
  document.getElementById("buttonsArray1").addEventListener('click',
      this.onClickYearsArray);
  document.getElementById("getOrganisationsBtnOk").addEventListener('click',
      this.onClickGetOrganisations);
  document.getElementById("createOrganisation").addEventListener('click',
      this.onClickCreateOrganisation);


  this.myTable.dataTable({
    data: this.Groups,
    "language": {
      "zeroRecords": "Такой записи не существует.",
      "emptyTable": "Ни одна из групп не выбрана.",
      "search": "Поиск:",
      "paginate": {
        "first": "Первый",
        "last": "Последний",
        "next": "Вперед",
        "previous": "Назад"
      },
      "infoFiltered": "(из _MAX_ студентов)",
      "lengthMenu": "Показать _MENU_ записей",
      "info": "Общее количество студентов: _TOTAL_ ",
      "infoEmpty": "Выберите группу."
    },
    "columns": [
      {"data": "group"},
      {"data": "student"},
      {"data": "organisation"}
    ]
  });
};

View.prototype.goToStudentsSection = function () {
  document.querySelector("#organisationsSection").style.display = "none";
  document.querySelector("#practiceCreationSection").style.display = "none";
  document.querySelector("#mainWindowSection").style.display = "block";
  document.getElementById("group-treeview-tabcontrol1-bachelor").style.display = "block";
};

View.prototype.goToOrganisationsSection = function () {
  document.querySelector("#practiceCreationSection").style.display = "none";
  document.querySelector("#mainWindowSection").style.display = "none";
  document.querySelector("#organisationsSection").style.display = "block";
};

View.prototype.goToPracticeCreation = function () {
  document.querySelector("#practiceCreationSection").style.display = "block";
  document.querySelector("#mainWindowSection").style.display = "none";
};
/*========================================PRACTICE SECTION==============================================*/
View.prototype.dialogPracticeCreatedInit = function () {
  let finishBtn = document.getElementsByClassName("btn-finish")[0];
  finishBtn.setAttribute("onclick",
      "metroDialog.open('#dialogPracticeCompleteSuccess')");
  let educationLevel = document.getElementById("selectEducation").value;
  let typePracticeText = "Учебная";
  let typePractice = document.getElementById("selectTypePractice").value;
  let educationLevelText = "Бакалавриат";
  if (educationLevel === "bachelor") {
    educationLevelText = "Бакалавриат";
  }
  else {
    educationLevelText = "Магистратура";
  }

  let fromDate = document.getElementById("fromDateInput").value;
  let toDate = document.getElementById("toDateInput").value;
  let deadline = document.getElementById("deadline").value;
  if (fromDate === "") {
    fromDate = "01. 01. 2000";
  }
  if (toDate === "") {
    toDate = "01. 01. 2000";
  }
  if (deadline === "") {
    deadline = "01. 01. 2000";
  }
  if (typePractice === "educational") {
    typePracticeText = "Учебная";
  }
  else if (typePractice === "internship") {
    typePracticeText = "Производственная";
  }
  else if (typePractice === "prediploma") {
    typePracticeText = "Преддипломная";
  }
  let treeView=null;
  for (let i = 0; i < this.idTreeViews.length; i++) {
    if (this.idTreeViews[i].indexOf("practice") !== -1 && document.getElementById(this.idTreeViews[i]).style.display == "block") {
     treeView=document.getElementById(this.idTreeViews[i]);
    }
  }
  let arrGroups = this.getSelectedGroups(treeView);
  let arrOrganisations = this.getSelectedGroups(document.getElementById("organisations-treeview-practice-creation"));


  document.getElementById("typePracticeDialog").innerHTML = typePracticeText;
  document.getElementById(
      "educationalLevelDialog").innerHTML = educationLevelText;
  document.getElementById("termsPracticeDialog").innerHTML = 'c ' + fromDate
      + ' по ' + toDate;
  document.getElementById("deadlinePracticeDialog").innerHTML = deadline;
  document.getElementById("groupsPracticeDialog").innerHTML = arrGroups;
  document.getElementById(
      "organisationsPracticeDialog").innerHTML = arrOrganisations;


  document.getElementById("mainWindowTypePractice").innerHTML = typePracticeText
      + " практика";
  document.getElementById("mainWindowTermsPractice").innerHTML = fromDate
      + ' - ' + toDate;

};
View.prototype.displayGroups = function () {
  let educationLevel = document.getElementById("selectEducation").value;
  if (educationLevel === "bachelor") {
    for (let i = 0; i < this.idTreeViews.length; i++) {
      if (this.idTreeViews[i].indexOf("master") !== -1) {
        document.getElementById(this.idTreeViews[i]).style.display = "none";
      }
      if (this.idTreeViews[i].indexOf("bachelor") !== -1) {
        document.getElementById(this.idTreeViews[i]).style.display = "block";
      }
    }
  }
  else {
    for (let i = 0; i < this.idTreeViews.length; i++) {
      if (this.idTreeViews[i].indexOf("bachelor") !== -1) {
        document.getElementById(this.idTreeViews[i]).style.display = "none";
      }
      if (this.idTreeViews[i].indexOf("master") !== -1) {
        document.getElementById(this.idTreeViews[i]).style.display = "block";
      }
    }
  }

};
View.prototype.clearPracticeSection = function () {
  document.getElementById("fromDateInput").value="";
  document.getElementById("toDateInput").value="";
  document.getElementById("deadline").value="";
};
/*============================================STUDENTS SECTION=====================================================*/
View.prototype.renderInfo = function () {
  let typePractice = document.getElementById("selectTypePracticeTab").value;
  let typePracticeText = "Учебная";
  if (typePractice === "educational") {
    typePracticeText = "Учебная";
  }
  else if (typePractice === "internship") {
    typePracticeText = "Производственная";
  }
  else if (typePractice === "prediploma") {
    typePracticeText = "Преддипломная";
  }
  document.getElementById("mainWindowTypePractice").innerHTML = typePracticeText
      + ' практика';
};
View.prototype.renderTable = function (data) {
  if (data.length === 0) {
    this.myTable.dataTable().fnClearTable();
  }
  else {
    this.myTable.dataTable().fnClearTable();
    this.myTable.dataTable().fnAddData(data);
  }
};

View.prototype.changeYear = function (node) {
  if (selectedElem) {
    selectedElem.classList.remove('current');
  }
  selectedElem = node;
  selectedElem.classList.add('current');
  this.selectedYear = selectedElem.innerHTML;
};

View.prototype.updateYear = function (event) {
  var target = event.target;
  while (target != buttonsArray) {
    if (target.className == 'item year') {
      this.changeYear(target);
      return;
    }
    target = target.parentNode;
  }
};

View.prototype.getSelectedGroups = function (treeView) {
  if(treeView===undefined)
  {
    let frames = document.getElementsByClassName("frames")[0].children;
    for (let i = 0; i < frames.length; i++) {
      if (frames[i].style.display == "block") {
        treeView = frames[i].children[0];
        break;
      }
    }
  }
  let Groups = [];
  let liNumber = treeView.querySelectorAll('li');
  for (let i = 0; i < liNumber.length; i++) {
    let groups = liNumber[i].querySelectorAll('input:checked');
    if (groups.length== 1) {
      for (let j = 0; j < groups.length; j++) {
        let group = groups[j].parentElement.nextElementSibling.innerHTML;
        if (group.indexOf("курс") === -1) {
          Groups.push(group);
        }
      }
    }
  }
  console.log(Groups);
  return Groups;
};

function tree_add_leaf_checkbox_example_click(tree, node, nameLeaf) {
  tree.addLeaf(node, nameLeaf, {
    mode: 'checkbox',
    checked: false
  });
}

function removeChildren(node) {
  var children = node.childNodes;
  while (children.length) {
    node.removeChild(children[0]);
  }
}

View.prototype.clearGroupsTreeView = function () {
  var id = 0;
  while (id < this.idTreeViews.length) {
    var liArray = document.getElementById(
        this.idTreeViews[id]).children[0].children;
    for (let i = 0; i < liArray.length; i++) {
      removeChildren(liArray[i].getElementsByTagName('ul')[0]);
    }
    id++;
  }
};
View.prototype.updateGroupsTreeView = function (courses) {
  let idCounter = 0, courseNumber = bachelorYear, cnt;
  let coursesName = ['first', 'second', 'third', 'fourth'];
  var i = 0;
  while (idCounter < this.idTreeViews.length) {
    var tree = $("#" + this.idTreeViews[idCounter]).data("treeview");
    if (this.idTreeViews[idCounter].indexOf("master") !== -1) {
      courseNumber = masterYear;
      i = bachelorYear;
    }
    else {
      courseNumber = bachelorYear;
      i = 0;
    }
    cnt = 0;
    for (i; i < courseNumber; i++) {
      for (let j = 0; j < courses[i].groups.length; j++) {
        let node = tree.element.find('li.' + coursesName[cnt]);
        tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
      }
      cnt++;
    }
    idCounter++;
  }
};

View.prototype.getConfigurations= function () {
  let typePractice=document.getElementById("selectTypePracticeOrganisationSec").value;
  let eduLevel=document.getElementById("selectEduLevelOrganisationSec").value;
  let years=document.getElementsByClassName("years");
  console.log(typePractice);
  console.log(eduLevel);
  console.log(this.selectedYear);
};
function tree_add_leaf_checkbox(tree, node, nameLeaf, idTypeOrganisation) {
  tree.addLeaf(node, nameLeaf, {
    mode: 'checkbox',
    checked: false
  });
  node.find('ul').find('li').last()[0].setAttribute("id",'type_org_'+idTypeOrganisation);
}
View.prototype.setTypesOrganisation= function (typesOrganisation) {
  var treeViewOrganisations = $("#organisations-treeview-practice-creation").data("treeview");
  for (let i=0; i < typesOrganisation.length; i++) {
    let node = treeViewOrganisations.element.find('li.node');
    tree_add_leaf_checkbox(treeViewOrganisations, node, typesOrganisation[i].name, typesOrganisation[i].id );
  }
};
View.prototype.clearTypesOrganisation= function () {
    var liArray = document.getElementById(
        'organisations-treeview-practice-creation').children[0].children;
    for (let i = 0; i < liArray.length; i++) {
      removeChildren(liArray[i].getElementsByTagName('ul')[0]);
    }
};
View.prototype.setOrganisationsInTreeView= function (organisations,typesOrganisation) {
  var tree = $("#organisations-treeview-practice-creation").data("treeview");
  for (let i=0; i < organisations.length; i++) {
    for (let j = 0; j < typesOrganisation.length; j++) {
      if(organisations[i].id_type_organisation===typesOrganisation[j].id)
      {
        let liArr= tree.element.find('li');
        let node;
        for (let k = 0; k < liArr.length; k++) {
          if(liArr[k].getAttribute("id")=== ('type_org_'+typesOrganisation[j].id))
          {
            node=$(liArr[k]);
            break;
          }
        }
        tree_add_leaf_checkbox_example_click(tree, node, organisations[i].name_organisation);
      }
    }
  }
};

View.prototype.getInfoNewOrganisation= function () {
  var e= document.getElementById("selectTypeCompany");
  var typeOrg = e.options[e.selectedIndex].text;
  let organisation = {
    'name': document.getElementById("nameCompany").value,
    'typeOrg': typeOrg,
    'infoOrg': document.getElementById("infoCompany").value,
    'emailOrg':document.getElementById("emailOrg").value,
    'phoneOrg':document.getElementById("phoneOrg").value,
    'placesOrg': document.getElementById("placesCompany").value,
    'loginOrg':document.getElementById("loginCompany").value,
    'pswdOrg':document.getElementById("pswdCompany").value,
    'addressOrg':document.getElementById("addressOrg").value
  }
  return organisation;
};

View.prototype.setTypesOrganisationSelect= function (typesOrganisation) {
  let typeOrg = document.getElementById("selectTypeCompany");
  removeChildren(typeOrg);
  for(let i=0;i<typesOrganisation.length;i++){
    let option = document.createElement('option');
    option.setAttribute("value", typesOrganisation[i].id);
    option.innerHTML= typesOrganisation[i].name;
    typeOrg.appendChild(option);
  }
};
module.exports = View;
