/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Controller = __webpack_require__(1);

__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);

document.addEventListener('DOMContentLoaded', () => {
  new Controller();
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const View = __webpack_require__(2);
const Model = __webpack_require__(3);

function Controller() {
    this.View = new View();
    this.Model = new Model();
    this.init();
}

const APPROVED = 1;
const REJECTED = 2;
Controller.prototype.init = async function () {
    this.View.OpenOrCloseLoader();
    await this.Model.init();
    await this.setYears();
    this.View.onClickNextStepDisplayGroupsTreeView = this.displayGroups.bind(this);
    this.View.onClickCreatePractice = this.goToPracticeCreation.bind(this);
    this.View.onClickAddPractice = this.createPractice.bind(this);
    this.View.onClickToOrganisationsSection = this.goToOrganisationsSection.bind(this);
    this.View.onClickToStudentsSection = this.goToStudentsSection.bind(this);
    this.View.onClickFinishBtn = this.dialogPracticeCreatedInit.bind(this);
    this.View.onClickSelectGroupBtnOk = this.renderDataInTable.bind(this);
    this.View.onClickYearsArray = this.setGroupsTreeView.bind(this);
    this.View.onClickGetOrganisations = this.getOrganisationsInCurrentPractice.bind(this);
    this.View.onClickCreateOrganisation = this.updateTreeView.bind(this);
    this.View.onClickDisplayInfoAboutOrg = this.displayInfoAboutOrg.bind(this);
    this.View.onClickDisplayOrganisations = this.goToOrganisationsSection.bind(this);
    this.View.onClickEditOrganisation = this.showDialogEditOrganisation.bind(this);
    this.View.onClickUpdateOrganisation = this.updateOrganisation.bind(this);
    this.View.onClickApproveStudent = this.changeStudentStatus.bind(this);
    this.View.onClickRejectStudent = this.changeStudentStatus.bind(this);
    this.View.onClickAddStudentToOrganisationShowDialog = this.addStudentToOrganisationShowDialog.bind(this);
    this.View.onClickAddStudentToOrganisation = this.addStudentToOrganisation.bind(this);
    this.View.onClickShowDialogGenerateDocument = this.showDialogGenerateDocument.bind(this);
    this.View.onClickGenerateDocument = this.generateDocument.bind(this);
    this.View.onChangeTypeDocument = this.initDialog.bind(this);
    this.View.init();
    await this.Model.getStudentsFromLDAP();
    this.View.OpenOrCloseLoader();
};

/*========================================GENERATE DOCUMENTS SECTION================================================*/
Controller.prototype.initDialog = async function () {
    let type_document = this.View.getSelectValue("gdtypeDocument");
    let isOrder = false;
    if (type_document === "Приказ") {
        isOrder = true;
        await this.createInputs(isOrder);
    } else {
        isOrder = false;
        await this.createInputs(isOrder);
    }
};

Controller.prototype.createInputs = async function (isOrder) {
    let selectedPractice = await this.View.getSelectedPractice("forStudentsSection")[0];
    let groups = selectedPractice.groups.split(',');
    if (isOrder) {
        //приказ
        let block = this.View.getElemById("groups-report-block");
        this.View.removeChildren(block);
        this.View.changeDisplay("report-block", "none");
        this.View.changeDisplay("order-block", "block");
        this.View.createInputsOrder(groups);
        this.View.changeInnerHtml("typeDocument", "приказа");
    } else {
        //отчет
        let practice = await this.Model.getPracticeById(selectedPractice.id);
        let block = this.View.getElemById("order-block");
        this.View.removeChildren(block);
        this.View.createInputsReport(groups);
        this.View.changeDisplay("report-block", "block");
        this.View.changeDisplay("order-block", "none");
        this.View.changeInnerHtml("typeDocument", "отчета");
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        this.View.fillDialog(practice, organisations);
    }
};

Controller.prototype.showDialogGenerateDocument = async function () {
    let practice = this.View.getSelectedPractice("forStudentsSection");
    if (practice.length !== 0) {
        practice = await this.Model.getPracticeById(practice[0].id);
        if (practice.id_type_practice === 2 || practice.id_type_practice === 3) {
            alert("Возможность генерации документов для преддипломной практики и научно-исследовательский работы в стадии разработки. Приносим свои извинения за предоставленные неудобства.");
            return;
        }
        this.View.dialogOpen("#dialogGenerateReport");
    } else {
        alert("Практика не выбрана. Выберите практику.");
    }
};

Controller.prototype.generateDocument = async function () {
    await this.View.readTextFile("/js/assets/json/data.json", function (text) {
        let data = JSON.parse(text);
        return data;
    });
    let selectedPractice = this.View.getSelectedPractice("forStudentsSection")[0];
    let groups = selectedPractice.groups.split(',');
    let practice = await this.Model.getPracticeById(selectedPractice.id);
    let type_document = this.View.getSelectValue("gdtypeDocument");
    let documents = 0,
        data = 0;

    if (type_document === "Приказ") {
        data = await this.getPreferencesStudentsOrganisations(selectedPractice);
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        documents = this.View.getInformationForDocumentOrder(practice, groups, this.Model.Groups, data, organisations);
    } else {
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        documents = this.View.getInformationForDocumentReport(practice, groups, this.Model.Groups, organisations);
    }
    for (let i = 0; i < documents.length; i++) {
        await this.Model.generateDocument(documents[i], type_document, practice.id_type_practice);
    }
};

/*========================================PRACTICE SECTION================================================*/
Controller.prototype.goToPracticeCreation = async function () {
    this.View.selectedYear = this.Model.getCurrentYear();
    this.View.clearPracticeSection();
    let typesOrganisation = await this.updateTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.goToPracticeCreation();
    this.View.selectedYear = this.Model.getCurrentYear();
};

Controller.prototype.displayGroups = function () {
    this.View.displayGroups();
};

Controller.prototype.dialogPracticeCreatedInit = function () {
    this.View.dialogPracticeCreatedInit();
};

Controller.prototype.updateTreeView = async function () {
    await this.createNewOrganisation();
    await this.updateTypesOrganisation();
};

Controller.prototype.createPractice = async function () {
    this.View.OpenOrCloseLoader();
    let practice = this.View.Practice;
    let groups = await this.Model.getDeterminedGroups(practice.groups);
    practice.groups = groups;
    await this.Model.createPractice(practice);
    this.View.OpenOrCloseLoader();
    await this.setYears();
    this.goToStudentsSection();
};

Controller.prototype.updateTypesOrganisation = async function () {
    let typesOrganisation = await this.Model.getTypesOrganisation();
    this.View.clearTypesOrganisation();
    this.View.setTypesOrganisation(typesOrganisation);
    let organisations = await this.Model.getOrganisations();
    this.View.setOrganisationsInTreeView(organisations, typesOrganisation);
    return typesOrganisation;
};
/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.setYears = async function () {
    let years = await this.Model.getPracticeYears();
    this.View.setYearsArray(years);
};

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
};

Controller.prototype.renderGroupsTreeView = async function () {
    await this.Model.distributeGroupsByCourses(this.View.selectedYear);
    await this.View.clearGroupsTreeView();
    await this.View.updateGroupsTreeView(this.Model.Courses, this.Model.Groups);
};

Controller.prototype.renderPracticeTreeView = async function () {
    await this.View.clearPracticeTreeView();
    let practices = await this.Model.getPractices();
    let types_practice = await this.Model.getTypesPractices();
    for (let i = 0; i < practices.length; i++) {
        if (this.View.selectedYear === practices[i].year) {
            let groups = await this.Model.getGroupsByPracticeId(practices[i]);
            groups = await this.Model.getGroupsNameByGroupsUID(groups);
            practices[i].groups = groups.join();
        }
    }
    this.View.setPracticesInTreeView(practices, types_practice);
};

Controller.prototype.setGroupsTreeView = async function (event) {
    this.View.updateYear(event);
    if (this.View.selectedYear === "+") {
        this.View.selectedYear = this.Model.getCurrentYear();
        await this.goToPracticeCreation();
    } else {
        await this.renderPracticeTreeView();
    }
    await this.renderGroupsTreeView();
};

Controller.prototype.getPreferencesStudentsOrganisations = async function (selectedPractice) {
    let groupsObjects = [];
    let practice = await this.Model.getPracticeById(selectedPractice.id);
    practice.groups = selectedPractice.groups.split(',');
    for (let k = 0; k < practice.groups.length; k++) {
        for (let j = 0; j < this.Model.Groups.length; j++) {
            if (practice.groups[k] === this.Model.Groups[j].name) {
                groupsObjects.push(this.Model.Groups[j]);
            }
        }
    }
    let requests = await this.Model.getRequests(practice, groupsObjects);
    await this.Model.assosiateRequestToStudent(requests, practice.groups);
    let requests_organisations = await this.Model.getRequestsOrganisations(practice.groups);
    let data = await this.Model.getData(practice.groups, requests_organisations);
    return data;
};

Controller.prototype.renderDataInTable = async function () {
    this.View.OpenOrCloseLoader();
    let data = [];
    let practices = this.View.getSelectedPractice("forStudentsSection");
    if (practices.length !== 0) {
        let practice = await this.Model.getPracticeById(practices[0].id);
        data = await this.getPreferencesStudentsOrganisations(practices[0]);

        this.View.renderTable(data);
        this.View.colorTable(data);
        this.View.renderInfo(practice);
    } else {
        alert("Практика не выбрана. Выберите практику.");
    }
    this.View.OpenOrCloseLoader();
};

/*========================================ORGANISATIONS SECTION================================================*/
Controller.prototype.goToOrganisationsSection = async function () {
    this.View.OpenOrCloseLoader();
    let organisations = await this.Model.getOrganisations();
    let typesOrganisation = await this.Model.getTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.setOrganisationsList(organisations, "allOrganisationsList");
    this.View.OpenOrCloseLoader();
    this.View.goToOrganisationsSection();
};

Controller.prototype.getApprovedAndNonApprovedStudents = async function (organisation) {
    let practice = await this.View.getSelectedPractice("forOrganisationSection")[0];
    practice = await this.Model.getPracticeById(practice.id);
    let approved_student_count = 0,
        non_approved_student_count = 0;
    if (practice.length !== 0) {
        approved_student_count = await this.renderStudentList(organisation, practice, "approvedStudents");
        non_approved_student_count = await this.renderStudentList(organisation, practice, "nonApprovedStudents");
    }
    this.View.updateOrganisationTitle(organisation.name, approved_student_count, non_approved_student_count);
};

Controller.prototype.displayInfoAboutOrg = async function (event) {
    let nameOrganisation = this.View.getSelectedOrganisation(event);
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
    await this.getApprovedAndNonApprovedStudents(organisation);
};

Controller.prototype.renderStudentList = async function (organisation, practice, idList) {
    let status;
    if (idList === "approvedStudents") {
        status = true;
    } else {
        status = false;
    }
    let studentsInfo = await this.Model.getRequestsByOrganisationId(organisation, practice, status);
    let students = await this.Model.getStudentsByUID(studentsInfo);
    this.View.updateStudentsListView(students, idList);
    return students.length;
};

Controller.prototype.getOrganisationsInCurrentPractice = async function () {

    let practice = await this.View.getSelectedPractice("forOrganisationSection")[0];
    if (practice !== undefined) {
        practice = await this.Model.getPracticeById(practice.id);
        let organisations = 0;
        if (practice.length !== 0) {
            organisations = await this.Model.getOrganisationsByPracticeId(practice);
            for (let i = 0; i < organisations.length; i++) {
                let requests_number = await this.Model.getRequestsByPracticeId_OrganisationId(practice.id_practice, organisations[i].id);
                organisations[i].num_vacant_places = organisations[i].max_students_number - requests_number;
            }
        }
        this.View.setOrganisationsList(organisations, "organisationList");
        this.View.renderOrganisationSection(practice);
    } else {
        alert("Практика не выбрана. Выберите практику.");
    }
};

Controller.prototype.getOrganisation = async function () {
    let nameOrganisation = this.View.getNameOrganisationByTitle();
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
    return organisation;
};

Controller.prototype.changeStudentStatus = async function (event) {
    this.View.OpenOrCloseLoader();
    let student = this.View.getSelectedStudent(event);
    await this.Model.updateRequestOrganisation(student);
    await this.Model.updateRequest(student);

    student['id_status'] = REJECTED;
    await this.Model.updateRequestOrganisationByRequest(student);

    let organisation = await this.getOrganisation();
    await this.getApprovedAndNonApprovedStudents(organisation);
    this.View.OpenOrCloseLoader();
};

Controller.prototype.updateOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.updateOrganisation(organisation);
};

Controller.prototype.createNewOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.createOrganisation(organisation);
};

Controller.prototype.addStudentToOrganisationShowDialog = async function (event) {
    let practice = await this.View.getSelectedPractice("forOrganisationSection")[0];
    practice = await this.Model.getPracticeById(practice.id);
    let uidsGroups = await this.Model.getGroupsByPracticeId(practice);
    let namesGroups = await this.Model.getGroupsNameByGroupsUID(uidsGroups);
    this.View.dialogEnableCheckboxes(namesGroups, "group-treeview-tabcontrol1-dialogAdd-bachelor");
    this.View.dialogEnableCheckboxes(namesGroups, "group-treeview-tabcontrol2-dialogAdd-master");
    let nameOrganisation = this.View.getOnClickNameOrganisation(event);
    this.View.changeInnerHtml("nameOrganisationDialog", nameOrganisation);
    this.View.dialogOpen("#dialogAddStudent");
};

Controller.prototype.addStudentToOrganisation = async function () {
    let students = await this.View.getSelectedStudents(event);
    let practice = await this.View.getSelectedPractice("forOrganisationSection")[0];
    practice = await this.Model.getPracticeById(practice.id);
    let nameOrganisation = this.View.getNameOrganisationInTreeview("organisationList");
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
    let requests = await this.Model.getRequestByStudentUIDS(practice, students);
    for (let i = 0; i < students.length; i++) {
        for (let j = 0; j < requests.length; j++) {
            if (students[i].uid === requests[j].uid_student) {
                students[i]['id_request'] = requests[j].id_request;
                students[i]['id_practice'] = practice.id_practice;
                students[i]['id_organisation'] = organisation.id;
                students[i]['id_status'] = APPROVED;
            }
        }
    }
    await this.Model.updateRequestsOrganisation(students);
    await this.Model.updateRequests(students);

    for (let j = 0; j < students.length; j++) {
        students[j]['id_status'] = REJECTED;
    }
    await this.Model.updateRequestsOrganisationByRequest(students);
    await this.getApprovedAndNonApprovedStudents(organisation);
};

Controller.prototype.showDialogEditOrganisation = async function (event) {
    let idOrganisation = this.View.getIdOrganisation(event);
    let organisation = await this.Model.getOrganisationById(idOrganisation);
    this.View.showDialogOrganisation(organisation);
};

module.exports = Controller;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const bachelorYear = 4;
const masterYear = 6;
let selectedElem = 0;

var View = function () {
    this.infoGroups = null;
    this.onClickNextStepDisplayGroupsTreeView = null;
    this.onClickPracticeCompleted = null;
    this.onClickCreatePractice = null;
    this.onClickAddPractice = null;
    this.onClickToOrganisationsSection = null;
    this.onClickToStudentsSection = null;
    this.onClickFinishBtn = null;
    this.onClickSelectGroupBtnOk = null;
    this.myTable = $('#studentsListTable');
    this.onClickYearsArray = null;
    this.selectedYear = null;
    this.idTreeViews = ['groups-treeview-practice-creation-bachelor', 'groups-treeview-practice-creation-master', 'group-treeview-tabcontrol1-dialogAdd-bachelor', 'group-treeview-tabcontrol2-dialogAdd-master'];
    this.idTreeViewsPractice = ['types-practice-treeview', 'types-practice-treeview-organisation-section'];
    this.onClickGetOrganisations = null;
    this.onClickCreateOrganisation = null;
    this.onClickDisplayInfoAboutOrg = null;
    this.onClickDisplayOrganisations = null;
    this.onClickEditOrganisation = null;
    this.onClickApproveStudent = null;
    this.onClickRejectStudent = null;
    this.onClickUpdateOrganisation = null;
    this.onClickAddStudentToOrganisationShowDialog = null;
    this.onClickAddStudentToOrganisation = null;
    this.onClickShowDialogGenerateDocument = null;
    this.onClickGenerateDocument = null;
    this.onChangeTypeDocument = null;
    this.Practice = null;
};

View.prototype.init = function () {
    document.getElementsByClassName("btn-next")[0].addEventListener('click', this.onClickNextStepDisplayGroupsTreeView);
    document.querySelector("#dialogPracticeCompleteSuccess").querySelector("#practiceFinishedOk").addEventListener('click', this.onClickPracticeCompleted);
    document.getElementById("organisationsSectionBtn").addEventListener('click', this.onClickToOrganisationsSection);
    document.getElementById("studentsSectionBtn").addEventListener('click', this.onClickToStudentsSection);
    document.getElementsByClassName("btn-finish")[0].addEventListener('click', this.onClickFinishBtn);
    document.getElementById("getGroupsBtnOk").addEventListener('click', this.onClickSelectGroupBtnOk);
    document.getElementById("buttonsArray").addEventListener('click', this.onClickYearsArray);
    document.getElementById("buttonsArray1").addEventListener('click', this.onClickYearsArray);
    document.getElementById("getOrganisationsBtnOk").addEventListener('click', this.onClickGetOrganisations);
    document.getElementById("createOrganisation").addEventListener('click', this.onClickCreateOrganisation);
    document.getElementById("practiceFinishedOk").addEventListener('click', this.onClickAddPractice);
    document.getElementById("showAllOrganisations").addEventListener('click', this.onClickDisplayOrganisations);
    document.getElementById("updateOrganisation").addEventListener('click', this.onClickUpdateOrganisation);
    document.getElementById("addStudentBtn").addEventListener('click', this.onClickAddStudentToOrganisation);
    document.getElementById("showDialogGenerateDocumentBtn").addEventListener('click', this.onClickShowDialogGenerateDocument);
    document.getElementById("generateDocumentBtn").addEventListener('click', this.onClickGenerateDocument);
    document.getElementById("gdtypeDocument").addEventListener('change', this.onChangeTypeDocument);

    this.myTable.dataTable({
        data: this.Groups,
        "language": {
            "zeroRecords": "Такой записи не существует.",
            "emptyTable": "Ни одна из групп не выбрана либо практики не существует.",
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
        "columns": [{ "data": "group" }, { "data": "student" }, { "data": "organisation" }]
    });
};

View.prototype.goToStudentsSection = function () {
    document.querySelector("#organisationsSection").style.display = "none";
    document.querySelector("#practiceCreationSection").style.display = "none";
    document.querySelector("#mainWindowSection").style.display = "block";

    let treeViews = document.getElementsByClassName("treeview");
    for (let i = 0; i < treeViews.length; i++) {
        treeViews[i].style.display = "block";
    }
};

View.prototype.goToOrganisationsSection = function () {
    document.querySelector("#practiceCreationSection").style.display = "none";
    document.querySelector("#mainWindowSection").style.display = "none";
    document.querySelector("#organisationsSection").style.display = "block";
    document.getElementById("studentsRequests").style.display = "none";
    document.getElementById("allOrganisationsListBlock").style.display = "block";
    document.getElementById("updateOrganisation").removeAttribute("disabled");
};

View.prototype.goToPracticeCreation = function () {
    document.querySelector("#practiceCreationSection").style.display = "block";
    document.querySelector("#mainWindowSection").style.display = "none";
    document.getElementById("updateOrganisation").setAttribute("disabled", "true");
};

/*========================================PRACTICE SECTION==============================================*/
View.prototype.dialogPracticeCreatedInit = function () {
    let finishBtn = document.getElementsByClassName("btn-finish")[0];
    finishBtn.setAttribute("onclick", "metroDialog.open('#dialogPracticeCompleteSuccess')");
    let educationLevel = document.getElementById("selectEducation").value;
    if (educationLevel === "bachelor") {
        educationLevel = "Бакалавриат";
    } else {
        educationLevel = "Магистратура";
    }
    let typePractice = document.getElementById("selectTypePractice").value;

    let lecNum = document.getElementById("lecNum").value;
    let fromDate = document.getElementById("fromDateInput").value;
    let numWeeks = document.getElementById("textWeeks").innerHTML;
    let toDate = document.getElementById("toDateInput").value + ' ' + numWeeks;
    let deadline = document.getElementById("deadline").value;
    document.getElementById("termsPracticeDialog").innerHTML = 'c ' + fromDate + ' по ' + toDate;
    document.getElementById("deadlinePracticeDialog").innerHTML = deadline;
    document.getElementById("mainWindowTermsPractice").innerHTML = fromDate + ' - ' + toDate;
    if (fromDate === "") {
        fromDate = "2000-01-01 21:00:00.000 +00:00";
    } else {
        fromDate = fromDate.substr(8, 4) + '-' + fromDate.substr(4, 2) + '-' + fromDate.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
    }
    if (toDate === "") {
        toDate = "2000-01-01 21:00:00.000 +00:00";
    } else {
        toDate = toDate.substr(8, 4) + '-' + toDate.substr(4, 2) + '-' + toDate.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
    }
    if (deadline === "") {
        deadline = "2000-01-01 21:00:00.000 +00:00";
    } else {
        deadline = deadline.substr(8, 4) + '-' + deadline.substr(4, 2) + '-' + deadline.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
    }

    let treeView = null;
    for (let i = 0; i < this.idTreeViews.length; i++) {
        if (this.idTreeViews[i].indexOf("practice") !== -1 && document.getElementById(this.idTreeViews[i]).style.display === "block") {
            treeView = document.getElementById(this.idTreeViews[i]);
        }
    }
    let arrGroups = this.getSelectedGroups(treeView);
    let arrOrganisations = this.getSelectedGroups(document.getElementById("organisations-treeview-practice-creation"));

    document.getElementById("typePracticeDialog").innerHTML = typePractice;
    document.getElementById("educationalLevelDialog").innerHTML = educationLevel;
    document.getElementById("groupsPracticeDialog").innerHTML = arrGroups;
    document.getElementById("organisationsPracticeDialog").innerHTML = arrOrganisations;

    document.getElementById("mainWindowTypePractice").innerHTML = typePractice + " практика";

    document.getElementById("lecNumDialog").innerHTML = lecNum;
    this.Practice = {
        'typePractice': typePractice,
        'startDatePractice': fromDate,
        'endDatePractice': toDate,
        'deadlinePractice': deadline,
        'lecNum': lecNum,
        'eduLevel': educationLevel,
        'organisations': arrOrganisations,
        'groups': arrGroups,
        'year': this.selectedYear
    };

    return this.Practice;
};

function roundPlus(x, n) {
    //x - число, n - количество знаков
    if (isNaN(x) || isNaN(n)) {
        return false;
    }
    var m = Math.pow(10, n);
    return Math.round(x * m) / m;
}

function getWeeks(first_date, second_date) {
    let first_array = first_date.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/);
    let second_array = second_date.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/);
    let first = Date.UTC(first_array[3], first_array[2] - 1, first_array[1]);
    let second = Date.UTC(second_array[3], second_array[2] - 1, second_array[1]);
    let weeks = Math.ceil((second - first) / (1000 * 60 * 60 * 24)) / 7;
    return weeks;
}

function isInteger(num) {
    return (num ^ 0) === num;
}

View.prototype.createWeeksText = function () {
    let toDate = document.getElementById("toDateInput");
    let fromDate = document.getElementById("fromDateInput");
    let toDateCalendar = document.getElementById("toDateCalendar");
    toDateCalendar.display = "none";

    let text = document.getElementById("textWeeks");
    text.style.display = "none";

    fromDate.onchange = function () {
        toDateCalendar.style.display = "inline-block";
        toDate.value = "";
    };
    toDate.onchange = function () {
        let weeks = getWeeks(fromDate.value.replace(/\s+/g, '') + " 00:00", toDate.value.replace(/\s+/g, '') + " 00:00");
        text.style.display = "block";
        weeks = roundPlus(weeks, 1);
        text.innerHTML = "Количество недель: " + weeks;
        if (isInteger(weeks)) {
            text.setAttribute("class", "margin20 green");
        } else {
            text.setAttribute("class", "margin20 red");
        }
    };
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
    } else {
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
    this.createWeeksText();

    let toDateCalendar = document.getElementById("toDateCalendar");
    toDateCalendar.style.display = "none";
    document.getElementById("fromDateInput").value = "";
    document.getElementById("toDateInput").value = "";
    toDateCalendar.value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("lecNum").value = "";
    for (let i = 0; i < this.idTreeViews.length; i++) {
        let inputs = document.getElementById(this.idTreeViews[i]).querySelectorAll('input');
        for (let j = 0; j < inputs.length; j++) {
            $(inputs[j]).attr('checked', false);
        }
    }
    /* let steps= document.getElementsByClassName("steps")[0].children;
     steps[0].style.display="block";
     for(let i=0;i<this.idTreeViews.length;i++){
         steps[i].style.display='none';
     }*/
};
/*============================================STUDENTS SECTION=====================================================*/
View.prototype.renderInfo = function (practice) {
    if (practice.length !== 0) {
        let start_year = practice.start_date_practice.substr(0, 4),
            start_month = practice.start_date_practice.substr(5, 2),
            start_day = practice.start_date_practice.substr(8, 2),
            end_year = practice.end_date_practice.substr(0, 4),
            end_month = practice.end_date_practice.substr(5, 2),
            end_day = practice.end_date_practice.substr(8, 2);
        let start_date = start_day + '-' + start_month + '-' + start_year;
        let end_date = end_day + '-' + end_month + '-' + end_year;
        document.getElementById("mainWindowTermsPractice").innerHTML = 'с ' + start_date + ' по ' + end_date;
        document.getElementById("mainWindowTypePractice").innerHTML = 'Практика ';
    } else {
        document.getElementById("mainWindowTypePractice").innerHTML = "Практики" + " не существует.";
        document.getElementById("mainWindowTermsPractice").innerHTML = " ";
    }
};
View.prototype.getSelectedPractice = function (section) {
    let id,
        Practices = [];
    if (section === "forOrganisationSection") {
        id = this.idTreeViewsPractice[1];
    } else {
        id = this.idTreeViewsPractice[0];
    }
    let treeView = document.getElementById(id);
    let liNumber = treeView.querySelectorAll('li');
    for (let i = 0; i < liNumber.length; i++) {
        let selectedPractices = liNumber[i].querySelectorAll('input:checked');
        if (selectedPractices.length === 1) {
            for (let j = 0; j < selectedPractices.length; j++) {
                let practice = {
                    "id": selectedPractices[j].parentElement.parentElement.getAttribute("data-uid"),
                    "groups": selectedPractices[j].parentElement.nextSibling.innerHTML
                };
                Practices.push(practice);
            }
        }
    }
    return Practices;
};

View.prototype.renderTable = function (data) {
    if (data === 0) {
        this.myTable.dataTable().fnClearTable();
    } else {
        this.myTable.dataTable().fnClearTable();
        this.myTable.dataTable().fnAddData(data);
    }
};

View.prototype.colorTable = function (data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].status === 1) {
            $(this.myTable.dataTable().fnGetNodes(i)).addClass("approved_stud");
            this.myTable.dataTable().fnGetNodes(i).children[0].setAttribute("class", "sorting_1 approved_stud");
        }
        if (data[i].status === 0) {
            $(this.myTable.dataTable().fnGetNodes(i)).addClass("applied_stud");
            this.myTable.dataTable().fnGetNodes(i).children[0].setAttribute("class", "sorting_1 applied_stud");
        }
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
    while (true) {
        if (target.className === 'item year' || target.className === 'item year current') {
            this.changeYear(target);
            return;
        }
        target = target.parentNode;
    }
};

View.prototype.getSelectedGroups = function (treeView) {
    if (treeView === undefined) {
        let frames = document.getElementsByClassName("frames")[0].children;
        for (let i = 0; i < frames.length; i++) {
            if (frames[i].style.display !== "none") {
                treeView = frames[i].children[0];
                break;
            }
        }
    }
    let Groups = [];
    let liNumber = treeView.querySelectorAll('li');
    for (let i = 0; i < liNumber.length; i++) {
        let groups = liNumber[i].querySelectorAll('input:checked');
        if (groups.length === 1) {
            for (let j = 0; j < groups.length; j++) {
                let group = groups[j].parentElement.nextElementSibling.innerHTML;
                if (group.indexOf("курс") === -1) {
                    Groups.push(group);
                }
            }
        }
    }
    return Groups;
};

async function tree_add_leaf_checkbox_example_click(tree, node, nameLeaf, uid) {
    await tree.addLeaf(node, nameLeaf, {
        mode: 'checkbox',
        checked: false,
        uid: uid
    });
}

View.prototype.removeChildren = function (node) {
    var children = node.childNodes;
    while (children.length) {
        node.removeChild(children[0]);
    }
};

View.prototype.clearGroupsTreeView = async function () {
    var id = 0;
    while (id < this.idTreeViews.length) {
        var liArray = document.getElementById(this.idTreeViews[id]).children[0].children;
        for (let i = 0; i < liArray.length; i++) {
            this.removeChildren(liArray[i].getElementsByTagName('ul')[0]);
        }
        id++;
    }
};
View.prototype.clearPracticeTreeView = async function () {
    for (let n = 0; n < this.idTreeViewsPractice.length; n++) {
        let id = this.idTreeViewsPractice[n];
        let liArray = document.getElementById(id).children[0].children;
        for (let i = 0; i < liArray.length; i++) {
            if (liArray[i].getElementsByTagName('ul').length === 1) {
                this.removeChildren(liArray[i].getElementsByTagName('ul')[0]);
            } else {
                let children = liArray[i].getElementsByTagName('ul')[0].children;
                for (let j = 0; j < children.length; j++) {
                    this.removeChildren(children[j].getElementsByTagName('ul')[0]);
                }
            }
        }
    }
};
View.prototype.updateGroupsTreeView = async function (courses, groups) {
    let idCounter = 0,
        courseNumber = bachelorYear,
        cnt;
    let coursesName = ['first', 'second', 'third', 'fourth'];
    var i = 0;
    while (idCounter < this.idTreeViews.length) {
        var tree = $("#" + this.idTreeViews[idCounter]).data("treeview");
        if (this.idTreeViews[idCounter].indexOf("master") !== -1) {
            courseNumber = masterYear;
            i = bachelorYear;
        } else {
            courseNumber = bachelorYear;
            i = 0;
        }
        cnt = 0;
        for (i; i < courseNumber; i++) {
            for (let j = 0; j < courses[i].groups.length; j++) {
                let node = tree.element.find('li.' + coursesName[cnt]);

                if (this.idTreeViews[idCounter] === "group-treeview-tabcontrol1-dialogAdd-bachelor" || this.idTreeViews[idCounter] === "group-treeview-tabcontrol2-dialogAdd-master") {
                    node[0].getElementsByTagName("input")[0].setAttribute("disabled", "disabled");
                    await tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
                    let elem = node.find('ul')[0].children[node.find('ul')[0].children.length - 1];
                    $(elem).addClass("collapsed");
                    elem.getElementsByTagName("input")[0].setAttribute("disabled", "disabled");
                    let students = 0;
                    for (let k = 0; k < groups.length; k++) {
                        if (courses[i].groups[j] === groups[k].name) {
                            students = groups[k].students;
                            break;
                        }
                    }
                    for (let k = 0; k < students.length; k++) {
                        await tree_add_leaf_checkbox_example_click(tree, $(elem), students[k].name, students[k].uid);
                    }
                    let inputs = elem.querySelectorAll('[data-uid]');
                    for (let k = 0; k < inputs.length; k++) {
                        inputs[k].getElementsByTagName("input")[0].setAttribute("disabled", "disabled");
                    }
                } else {
                    await tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
                }
            }
            cnt++;
        }
        idCounter++;
    }
};
View.prototype.myUpdateTreeView = async function (courses, id) {
    let courseNumber = bachelorYear,
        n;
    let coursesName = ['first', 'second', 'third', 'fourth'];
    var i = 0;

    var tree = $("#" + id).data("treeview");
    if (id.indexOf("master") !== -1) {
        courseNumber = masterYear;
        i = bachelorYear;
    } else {
        courseNumber = bachelorYear;
        i = 0;
    }
    n = 0;
    for (i; i < courseNumber; i++) {
        for (let j = 0; j < courses[i].groups.length; j++) {
            let node = tree.element.find('li.' + coursesName[n]);
            tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
        }
        n++;
    }
};
View.prototype.getConfigurationPractice = function () {
    let typePractice = document.getElementById("selectTypePracticeOrganisationSec").value;
    let eduLevel = document.getElementById("selectEduLevelOrganisationSec").value;
    let info_about_practice = {
        'typePractice': typePractice,
        'year': this.selectedYear,
        'edu_level': eduLevel
    };
    return info_about_practice;
};

function tree_add_leaf_checkbox(tree, node, nameLeaf, idTypeOrganisation) {
    tree.addLeaf(node, nameLeaf, {
        mode: 'checkbox',
        checked: false
    });
    node.find('ul').find('li').last()[0].setAttribute("id", 'type_org_' + idTypeOrganisation);
}

View.prototype.setTypesOrganisation = function (typesOrganisation) {
    var treeViewOrganisations = $("#organisations-treeview-practice-creation").data("treeview");
    for (let i = 0; i < typesOrganisation.length; i++) {
        let node = treeViewOrganisations.element.find('li.node');
        tree_add_leaf_checkbox(treeViewOrganisations, node, typesOrganisation[i].name, typesOrganisation[i].id);
    }
};
View.prototype.setPracticesInTreeView = function (practices, typesPractices) {
    for (let n = 0; n < this.idTreeViewsPractice.length; n++) {
        let id = this.idTreeViewsPractice[n];
        var tree = $("#" + id).data("treeview");
        for (let i = 0; i < practices.length; i++) {
            for (let j = 0; j < typesPractices.length; j++) {
                if (practices[i].id_type_practice === typesPractices[j].id) {
                    let liArr = tree.element.find('li');
                    let node;
                    for (let k = 0; k < liArr.length; k++) {
                        if (liArr[k].getAttribute("id") === 'type_pract_' + typesPractices[j].id) {
                            node = $(liArr[k]);
                            break;
                        }
                    }
                    if (practices[i].groups !== undefined) {
                        tree_add_leaf_checkbox_example_click(tree, node, practices[i].groups, practices[i].id_practice);
                    }
                }
            }
        }
    }
};
View.prototype.clearTypesOrganisation = function () {
    var liArray = document.getElementById('organisations-treeview-practice-creation').children[0].children;
    for (let i = 0; i < liArray.length; i++) {
        this.removeChildren(liArray[i].getElementsByTagName('ul')[0]);
    }
};
View.prototype.setOrganisationsInTreeView = function (organisations, typesOrganisation) {
    var tree = $("#organisations-treeview-practice-creation").data("treeview");
    for (let i = 0; i < organisations.length; i++) {
        for (let j = 0; j < typesOrganisation.length; j++) {
            if (organisations[i].id_type_organisation === typesOrganisation[j].id) {
                let liArr = tree.element.find('li');
                let node;
                for (let k = 0; k < liArr.length; k++) {
                    if (liArr[k].getAttribute("id") === 'type_org_' + typesOrganisation[j].id) {
                        node = $(liArr[k]);
                        break;
                    }
                }
                tree_add_leaf_checkbox_example_click(tree, node, organisations[i].name);
            }
        }
    }
};

View.prototype.getInfoNewOrganisation = function () {
    var e = document.getElementById("selectTypeCompany");
    var typeOrg = e.options[e.selectedIndex].text;
    let organisation = {
        'name': document.getElementById("nameCompany").value,
        'typeOrg': typeOrg,
        'infoOrg': document.getElementById("infoCompany").value,
        'emailOrg': document.getElementById("emailOrg").value,
        'phoneOrg': document.getElementById("phoneOrg").value,
        'placesOrg': document.getElementById("placesCompany").value,
        'loginOrg': document.getElementById("loginCompany").value,
        'pswdOrg': document.getElementById("pswdCompany").value,
        'addressOrg': document.getElementById("addressOrg").value,
        'id': document.getElementById("idCompany").innerHTML
    };
    return organisation;
};

View.prototype.setTypesOrganisationSelect = function (typesOrganisation) {
    let typeOrg = document.getElementById("selectTypeCompany");
    this.removeChildren(typeOrg);
    for (let i = 0; i < typesOrganisation.length; i++) {
        let option = document.createElement('option');
        option.setAttribute("value", typesOrganisation[i].id);
        option.innerHTML = typesOrganisation[i].name;
        typeOrg.appendChild(option);
    }
};

View.prototype.setOrganisationsList = function (organisations, idList) {
    let listOrg = document.getElementById(idList);
    this.removeChildren(listOrg);
    for (let i = 0; i < organisations.length; i++) {
        let div_list = document.createElement('div');
        div_list.setAttribute("class", "list");

        let div_list_content = document.createElement('div');
        div_list_content.setAttribute("class", "list-content inline-block");
        if (idList === "organisationList") {
            div_list_content.addEventListener("click", this.onClickDisplayInfoAboutOrg);
        }

        let span_list_title = document.createElement('span');
        span_list_title.setAttribute("class", "list-title");
        span_list_title.setAttribute("id_organisation", organisations[i].id);
        span_list_title.innerHTML = organisations[i].name;
        div_list_content.appendChild(span_list_title);
        if (idList === "organisationList") {
            let span_list_subtitle = document.createElement('span');
            span_list_subtitle.setAttribute("class", "list-subtitle");
            span_list_subtitle.innerHTML = 'Всего мест: ' + organisations[i].max_students_number;
            div_list_content.appendChild(span_list_subtitle);

            let span_list_remark = document.createElement('span');
            span_list_remark.setAttribute("class", "list-remark");
            span_list_remark.innerHTML = 'Осталось: ' + organisations[i].num_vacant_places;
            div_list_content.appendChild(span_list_remark);
        }

        div_list.appendChild(div_list_content);

        let div_settings_organisation = document.createElement('div');
        div_settings_organisation.setAttribute("class", "inline-block list-content settingsOrganisation");
        if (idList === "organisationList") {
            let span_user_plus = document.createElement('span');
            span_user_plus.setAttribute("class", "mif-user-plus mif-lg fg-gray add-student-organisation");
            span_user_plus.addEventListener("click", this.onClickAddStudentToOrganisationShowDialog);
            div_settings_organisation.appendChild(span_user_plus);
        }

        let span_pencil = document.createElement('span');
        span_pencil.setAttribute("class", "mif-pencil mif-lg fg-gray edit-organisation");
        span_pencil.addEventListener("click", this.onClickEditOrganisation);
        div_settings_organisation.appendChild(span_pencil);

        /* let span_cancel = document.createElement('span');
         span_cancel.setAttribute("class", "mif-cancel mif-lg fg-yellow");
         div_settings_organisation.appendChild(span_cancel);*/

        div_list.appendChild(div_settings_organisation);

        listOrg.appendChild(div_list);
    }
};
View.prototype.getIdOrganisation = function (event) {
    let idOrganisation = 0;
    if (event.target.id === "updateOrganisation") {
        idOrganisation = +event.target.parentElement.children[1].children[0].children[2].innerHTML;
    } else {
        idOrganisation = event.target.parentElement.parentElement.children[0].children[0].getAttribute("id_organisation");
    }
    return idOrganisation;
};

View.prototype.getNameOrganisationInTreeview = function (idTreeview) {
    let parent = document.getElementById(idTreeview);
    let nameOrganisation = parent.getElementsByClassName("active")[0].querySelector('[id_organisation').innerHTML;
    return nameOrganisation;
};

View.prototype.showDialogOrganisation = function (organisation) {
    document.getElementById("nameCompany").value = organisation.name;
    document.getElementById("idCompany").innerHTML = organisation.id;
    document.getElementById("infoCompany").value = organisation.info_organisation;
    document.getElementById("phoneOrg").value = organisation.phone_organisation;
    document.getElementById("emailOrg").value = organisation.email_organisation;
    document.getElementById("addressOrg").value = organisation.address_organisation;
    document.getElementById("placesCompany").value = organisation.max_students_number;
    document.getElementById("loginCompany").value = organisation.login_organisation;
    document.getElementById("pswdCompany").value = organisation.pswd_organisation;
    metroDialog.open('#dialogCreateCompany');
};
View.prototype.dialogOpen = function (id) {
    metroDialog.open(id);
};

View.prototype.updateOrganisationTitle = function (nameOrganisation, approved_student_count, non_approved_student_count) {
    if (non_approved_student_count === 0) {
        document.getElementById("nonApprovedStudentListTitle").innerHTML = ", пуст";
    } else {
        document.getElementById("nonApprovedStudentListTitle").innerHTML = "";
    }
    document.getElementById("orgName").innerHTML = nameOrganisation;

    if (approved_student_count === 0) {
        document.getElementById("approvedStudentListTitle").innerHTML = "Список утвержденных студентов пуст.";
    } else {
        document.getElementById("approvedStudentListTitle").innerHTML = "Список утвержденных студентов.";
    }
};

View.prototype.getSelectedOrganisation = function (event) {
    let element = event.target;
    while (true) {
        if (element.className === "list-content inline-block") {
            break;
        }
        element = element.parentElement;
    }
    let nameOrganisationClick = element.children[0].innerHTML;
    return nameOrganisationClick;
};

View.prototype.getNameOrganisationByTitle = function () {
    return document.getElementById("orgName").innerHTML;
};

View.prototype.getOnClickNameOrganisation = function (event) {
    return event.target.parentElement.parentElement.children[0].children[0].innerHTML;
};

View.prototype.updateStudentsListView = function (students, idList) {
    let listStudents = document.getElementById(idList);
    this.removeChildren(listStudents);
    for (let i = 0; i < students.length; i++) {
        let div_list = document.createElement('div');
        div_list.setAttribute("class", "list");

        let div_list_content = document.createElement('div');
        div_list_content.setAttribute("class", "list-content inline-block");

        let span_list_title = document.createElement('span');
        span_list_title.setAttribute("class", "list-title");
        span_list_title.setAttribute("request", students[i].id_request);
        span_list_title.setAttribute("uid", students[i].uid_student);
        span_list_title.setAttribute("org", students[i].id_organisation);
        span_list_title.innerHTML = students[i].displayName;
        div_list_content.appendChild(span_list_title);

        let span_list_subtitle = document.createElement('span');
        span_list_subtitle.setAttribute("class", "list-subtitle");
        span_list_subtitle.innerHTML = students[i].group_name;
        div_list_content.appendChild(span_list_subtitle);

        let year = students[i].date_creation_request.substr(0, 4),
            month = students[i].date_creation_request.substr(5, 2),
            day = students[i].date_creation_request.substr(8, 2);
        let date = day + '-' + month + '-' + year;

        let span_list_remark = document.createElement('span');
        span_list_remark.setAttribute("class", "list-remark");
        span_list_remark.innerHTML = 'Дата записи: ' + date;
        div_list_content.appendChild(span_list_remark);

        div_list.appendChild(div_list_content);

        let div_settings_organisation = document.createElement('div');
        div_settings_organisation.setAttribute("class", "inline-block list-content settingsOrganisation");

        if (idList !== "approvedStudents") {
            let span_student_approve = document.createElement('span');
            span_student_approve.setAttribute("class", "mif-checkmark mif-lg fg-green");
            span_student_approve.addEventListener("click", this.onClickApproveStudent);
            div_settings_organisation.appendChild(span_student_approve);
        }

        let span_student_reject = document.createElement('span');
        span_student_reject.setAttribute("class", "mif-cancel mif-lg fg-red");
        span_student_reject.addEventListener("click", this.onClickRejectStudent);
        div_settings_organisation.appendChild(span_student_reject);

        div_list.appendChild(div_settings_organisation);

        listStudents.appendChild(div_list);
    }
    document.getElementById("allOrganisationsListBlock").style.display = "none";
    document.getElementById("studentsRequests").style.display = "block";
};

View.prototype.renderOrganisationSection = function (practice) {
    let text = document.getElementById("organisationListCurrentPracticeText");
    if (practice.length !== 0) {
        text.innerHTML = "Список организаций в практике";
    } else {
        text.innerHTML = "Практики не существует.";
    }
};

View.prototype.OpenOrCloseLoader = function (id) {
    if (id === undefined) id = "load";
    let display = document.getElementById(id).style.display;
    if (display === "block") {
        document.getElementById(id).style.display = "none";
    } else {
        document.getElementById(id).style.display = "block";
    }
};

View.prototype.getSelectedStudent = function (event) {
    let node = event.target.parentElement.parentElement.querySelector('[request]');
    let student = {
        'id_request': node.getAttribute("request"),
        'uid_student': node.getAttribute("uid"),
        'id_organisation': node.getAttribute("org")
    };

    if (event.target.getAttribute("class").indexOf("mif-cancel") === 0) {
        student['id_status'] = 2;
    } else {
        student['id_status'] = 1;
    }
    return student;
};
View.prototype.setYearsArray = function (years) {
    let buttonArray = document.getElementById("buttonsArray");
    let buttonArray1 = document.getElementById("buttonsArray1");
    this.removeChildren(buttonArray);
    this.removeChildren(buttonArray1);
    for (let i = 0; i < years.length; i++) {
        let span = document.createElement('span');
        span.setAttribute("class", "item year");
        span.innerHTML = years[i];
        buttonArray.appendChild(span);

        let span1 = document.createElement('span');
        span1.setAttribute("class", "item year");
        span1.innerHTML = years[i];
        buttonArray.appendChild(span);
        buttonArray1.appendChild(span1);
    }
    let span = document.createElement('span');
    span.setAttribute("class", "item year");
    span.setAttribute("id", "createPracticeBtn");
    span.innerHTML = "+";
    buttonArray.appendChild(span);
    document.getElementById("createPracticeBtn").addEventListener('click', this.onClickCreatePractice);
};

View.prototype.getSelectedStudents = function (event) {
    let Students = [];
    let nodes = event.target.parentElement.querySelectorAll('input:checked');
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].parentElement.nextSibling.innerHTML.indexOf("курс") === -1 && isNaN(+nodes[i].parentElement.nextElementSibling.innerHTML.substr(0, 2))) {
            let name = nodes[i].parentElement.nextElementSibling.innerHTML;
            let uid = nodes[i].parentElement.parentElement.getAttribute("data-uid");
            Students.push({
                name: name,
                uid: uid
            });
        }
    }
    return Students;
};

View.prototype.dialogEnableCheckboxes = function (namesGroups, idElement) {
    let parent = document.getElementById(idElement);
    let inputs = parent.querySelectorAll('input');

    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < namesGroups.length; j++) {
            let course = inputs[i].parentElement.parentElement.parentElement.parentElement;
            course.classList.remove('active-course');
            let studentsCheckboxes = inputs[i].parentElement.parentElement.querySelectorAll('[data-uid]');
            if (studentsCheckboxes.length !== 0) studentsCheckboxes[0].parentElement.parentElement.setAttribute("disabled", "true");
            for (let n = 0; n < studentsCheckboxes.length; n++) {
                studentsCheckboxes[n].querySelector('input').setAttribute("disabled", "true");
            }
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < namesGroups.length; j++) {
            if (inputs[i].parentElement.nextSibling.innerHTML === namesGroups[j]) {
                let course = inputs[i].parentElement.parentElement.parentElement.parentElement;
                if (course.getAttribute("data-mode") === "checkbox" && course.getAttribute("class").indexOf("active-course") === -1) {
                    $(course).addClass("active-course");
                }
                inputs[i].removeAttribute("disabled");
                let studentsCheckboxes = inputs[i].parentElement.parentElement.querySelectorAll('[data-uid]');

                for (let n = 0; n < studentsCheckboxes.length; n++) {
                    studentsCheckboxes[n].querySelector('input').removeAttribute("disabled");
                }
            }
        }
    }
};

View.prototype.getElemById = function (id) {
    let elem = document.getElementById(id);
    return elem;
};

View.prototype.createInputsOrder = function (selectedGroups) {
    let parent = document.getElementById("order-block");
    this.removeChildren(parent);
    let h4 = document.createElement("h4");
    h4.innerHTML = "Руководители";
    h4.setAttribute("class", "align-center");
    parent.appendChild(h4);
    for (let i = 0; i < selectedGroups.length; i++) {
        let div = document.createElement("div");
        div.setAttribute("class", "field margin20");

        let p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = selectedGroups[i];
        div.appendChild(p);

        let input = document.createElement("input");
        input.setAttribute("groupName", selectedGroups[i]);
        div.appendChild(input);

        parent.appendChild(div);
    }
};

View.prototype.createInputsReport = function (selectedGroups) {
    let parent = document.getElementById("groups-report-block");
    this.removeChildren(parent);
    let h4 = document.createElement("h4");
    h4.innerHTML = "Информация по каждой группе";
    h4.setAttribute("class", "align-center");
    parent.appendChild(h4);
    for (let i = 0; i < selectedGroups.length; i++) {
        let div_group = document.createElement("div");
        div_group.setAttribute("class", "group " + selectedGroups[i]);

        let h4 = document.createElement("h4");
        h4.innerHTML = selectedGroups[i];
        h4.setAttribute("class", "align-center");
        div_group.appendChild(h4);

        let div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        let p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Руководитель";
        div.appendChild(p);
        let input = document.createElement("input");
        input.setAttribute("class", "supervisor");
        div.appendChild(input);
        div_group.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Студ. (4 и 5)";
        div.appendChild(p);
        input = document.createElement("input");
        input.setAttribute("class", "good_students");
        input.setAttribute("type", "number");
        div.appendChild(input);
        div_group.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Кол-во препод.-руковод.";
        div.appendChild(p);
        input = document.createElement("input");
        input.setAttribute("class", "teacher_number");
        input.setAttribute("type", "number");
        div.appendChild(input);
        div_group.appendChild(div);
        parent.appendChild(div_group);
    }
};

View.prototype.formatDate = function (date) {
    let year = date.substr(0, 4),
        month = date.substr(5, 2),
        day = date.substr(8, 2);
    return day + '.' + month + '.' + year;
};

View.prototype.getInformationForDocumentOrder = function (practice, selectedGroups, allGroups, data, organisations) {
    let groupsForDocument = [];
    let educational_level = practice.edu_level;
    let blockTeachers = document.getElementById("order-block").getElementsByTagName('div');
    let teachers = [];
    for (let i = 0; i < blockTeachers.length; i++) {
        let groupName = blockTeachers[i].children[0].innerHTML;
        let teacher = blockTeachers[i].children[1].value;
        for (let j = 0; j < selectedGroups.length; j++) {
            if (selectedGroups[j] === groupName) {
                teachers.push({
                    "teacher": teacher,
                    "groupName": groupName
                });
            }
        }
    }
    for (let i = 0; i < selectedGroups.length; i++) {
        for (let j = 0; j < this.infoGroups.length; j++) {
            if (selectedGroups[i].indexOf(this.infoGroups[j].name) !== -1 && this.infoGroups[j].type === educational_level) {
                for (let n = 0; n < allGroups.length; n++) {
                    if (selectedGroups[i] === allGroups[n].name) {
                        for (let k = 0; k < teachers.length; k++) {
                            if (selectedGroups[i] === teachers[k].groupName) {
                                allGroups[n].teacher = teachers[k].teacher;
                                allGroups[n].type = this.infoGroups[j].type;
                                allGroups[n].fullName = this.infoGroups[j].fullName;
                                allGroups[n].profile = this.infoGroups[j].profile;
                                groupsForDocument.push(allGroups[n]);
                            }
                        }
                    }
                }
            }
        }
    }
    let dean = document.getElementById("dean").value;
    let head_of_department = document.getElementById("head_of_department").value;
    let type_document = document.getElementById("gdtypeDocument").options[document.getElementById("gdtypeDocument").selectedIndex].value;
    let documents = [];
    let typePractice = practice.Type_practice.name;
    if (practice.id_type_practice === 2 || practice.id_type_practice === 3 || practice.id_type_practice === 4) {
        typePractice = "производственная";
    }
    typePractice = typePractice.toLowerCase();
    typePractice = typePractice.replaceAt(typePractice.length - 1, "й");
    typePractice = typePractice.replaceAt(typePractice.length - 2, "о");
    typePractice = typePractice.toLowerCase();

    let start_date = this.formatDate(practice.start_date_practice);
    let end_date = this.formatDate(practice.end_date_practice);
    if (typePractice === "учебной") {
        for (let i = 0; i < groupsForDocument.length; i++) {
            let students = groupsForDocument[i].students;
            let str = JSON.stringify(students, ["name"]);
            students = JSON.parse(str);
            let document = {
                "direction": groupsForDocument[i].fullName,
                "profile": groupsForDocument[i].profile,
                "dean": dean,
                "head_of_department": head_of_department,
                "type_practice": typePractice,
                "start_date": start_date,
                "end_date": end_date,
                "group_name": groupsForDocument[i].name,
                "supervisor": groupsForDocument[i].teacher,
                "students": students
            };
            documents.push(document);
        }
    } else if (typePractice === "производственной") {
        if (practice.id_type_practice === 2) {
            alert("Возможность генерации документов для преддипломной практики в стадии разработки. Приносим свои извинения за предоставленные неудобства.");
        } else if (practice.id_type_practice === 3) {
            alert("Возможность генерации документов для научно-исследовательской работы в стадии разработки. Приносим свои извинения за предоставленные неудобства.");
        } else {
            for (let i = 0; i < organisations.length; i++) {
                organisations[i].students = [];
            }
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < groupsForDocument.length; j++) {
                    if (data[i].group === groupsForDocument[j].name) {
                        for (let k = 0; k < groupsForDocument[j].students.length; k++) {
                            if (data[i].student === groupsForDocument[j].students[k].name) {
                                for (let n = 0; n < organisations.length; n++) {
                                    if (data[i].organisation === organisations[n].name) {
                                        organisations[n].group = groupsForDocument[j].name;
                                        organisations[n].organization_name = organisations[n].name;
                                        organisations[n].teacher = groupsForDocument[j].teacher;
                                        let student = data[i].student;
                                        organisations[n].students.push({ "name": student });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < groupsForDocument.length; i++) {
                let organisations_for_document = [];
                for (let j = 0; j < organisations.length; j++) {
                    if (organisations[j].group === groupsForDocument[i].name) {
                        let students = JSON.stringify(organisations[j].students);
                        students = JSON.parse(students);
                        let str = JSON.stringify(organisations[j], ["organization_name", "teacher"]);
                        organisations[j] = JSON.parse(str);
                        organisations[j].students = students;
                        organisations_for_document.push(organisations[j]);
                    }
                }
                let document = {
                    "direction": groupsForDocument[i].fullName,
                    "profile": groupsForDocument[i].profile,
                    "dean": dean,
                    "course": "1",
                    "head_of_department": head_of_department,
                    "type_practice": typePractice,
                    "start_date": start_date,
                    "end_date": end_date,
                    "group_name": groupsForDocument[i].name,
                    "supervisor": groupsForDocument[i].teacher,
                    "organizations": organisations_for_document
                };
                documents.push(document);
            }
        }
    }
    return documents;
};

View.prototype.getInformationForDocumentReport = function (practice, selectedGroups, allGroups) {
    let educational_level = practice.edu_level;
    let groupsForDocument = [];
    let blockGroups = document.getElementById("groups-report-block").getElementsByClassName('group');
    let additional_info = [];
    for (let i = 0; i < blockGroups.length; i++) {
        let groupName = blockGroups[i].getElementsByTagName('h4')[0].innerHTML;
        let supervisor = blockGroups[i].getElementsByClassName("supervisor")[0].value;
        let good_students_number = blockGroups[i].getElementsByClassName("good_students")[0].value;
        let teacher_number = blockGroups[i].getElementsByClassName("teacher_number")[0].value;
        for (let j = 0; j < selectedGroups.length; j++) {
            if (selectedGroups[j] === groupName) {
                additional_info.push({
                    "groupName": groupName,
                    "supervisor": supervisor,
                    "good_stud_num": good_students_number,
                    "teacher_number": teacher_number
                });
            }
        }
    }
    for (let i = 0; i < selectedGroups.length; i++) {
        for (let j = 0; j < this.infoGroups.length; j++) {
            if (selectedGroups[i].indexOf(this.infoGroups[j].name) !== -1 && this.infoGroups[j].type === educational_level) {
                for (let n = 0; n < allGroups.length; n++) {
                    if (selectedGroups[i] === allGroups[n].name) {
                        for (let k = 0; k < additional_info.length; k++) {
                            if (selectedGroups[i] === additional_info[k].groupName) {
                                allGroups[n].supervisor = additional_info[k].supervisor;
                                allGroups[n].fullName = this.infoGroups[j].fullName;
                                allGroups[n].good_stud_num = additional_info[k].good_stud_num;
                                allGroups[n].teacher_number = additional_info[k].teacher_number;
                                groupsForDocument.push(allGroups[n]);
                            }
                        }
                    }
                }
            }
        }
    }

    let start_date = this.formatDate(practice.start_date_practice);
    let end_date = this.formatDate(practice.end_date_practice);

    let head_of_department = document.getElementById("head_of_department").value;
    let documents = [];
    let typePractice = practice.Type_practice.name;
    typePractice = typePractice.toLowerCase();

    let course = document.getElementById("course").value;
    let base_practice = document.getElementById("base_practice").value;
    let num_base_practice = document.getElementById("num_base_practice").value;
    let num_lections = document.getElementById("num_lections").value;

    for (let i = 0; i < groupsForDocument.length; i++) {
        let document = {
            "direction": groupsForDocument[i].fullName,
            "course": course,
            "type_practice": typePractice,
            "start_date": start_date,
            "end_date": end_date,
            "group_name": groupsForDocument[i].name,
            "base_practice": base_practice,
            "year": practice.year,
            "teacher_number": groupsForDocument[i].teacher_number,
            "student_number": groupsForDocument[i].students.length,
            "good_stud_num": groupsForDocument[i].good_stud_num,
            "num_base_practice": num_base_practice,
            "num_lections": num_lections,
            "supervisor": groupsForDocument[i].supervisor,
            "head_of_department": head_of_department
        };
        documents.push(document);
    }

    return documents;
};
View.prototype.getSelectValue = function (id) {
    let value = document.getElementById(id).options[document.getElementById(id).selectedIndex].value;
    return value;
};

View.prototype.changeDisplay = function (id, value) {
    let elem = document.getElementById(id);
    elem.style.display = value;
};

View.prototype.changeInnerHtml = function (id, value) {
    let elem = document.getElementById(id);
    elem.innerHTML = value;
};

View.prototype.fillDialog = function (practice, organisations) {
    let elem = document.getElementById("base_practice");
    for (let i = 0; i < organisations.length; i++) {
        elem.value += organisations[i].name + ', ';
    }
    elem = document.getElementById("num_base_practice");
    elem.value = organisations.length;

    elem = document.getElementById("num_lections");
    elem.value = +practice.lections_number;
};
View.prototype.readTextFile = function (file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            var res = callback(rawFile.responseText);
            this.infoGroups = res;
            return res;
        }
    }.bind(this);
    rawFile.send(null);
};

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

module.exports = View;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const SEPTEMBER = 9;
const firstCourse = 0;
const secondCourse = 1;
const thirdCourse = 2;
const fourthCourse = 3;
const masterFirstCourse = 4;
const masterSecondCourse = 5;
const REJECTED = 2;
const APPROVED = 1;
const APPLY = 0;
const CONFIG = __webpack_require__(4);
var Model = function () {
    this.Groups = [];
    this.Students = [];
    this.Courses = [];
    this.typesOrganisation = [];
    this.Organisations = [];
};

class Course {
    constructor(nameCourse) {
        this.nameCourse = nameCourse;
        this.groups = [];
    }

    addGroup(group) {
        this.groups.push(group);
    }
}

class Group {
    constructor(uid_LDAP, nameGroup) {
        this.name = nameGroup;
        this.uid_LDAP = uid_LDAP;
        this.students = [];
    }

    addStudent(student) {
        this.students.push(student);
    }
}

/*============================================STUDENTS SECTION=====================================================*/
Model.prototype.getData = async function (selectedGroups, requests_organisations) {
    let data = [];
    for (let i = 0, l = 0; i < this.Groups.length; ++i) {
        for (let j = 0; j < selectedGroups.length; ++j) {
            if (this.Groups[i].name === selectedGroups[j]) {
                for (let k = 0; k < this.Groups[i].students.length; ++k, ++l) {
                    let isStudentApply = false;
                    data.push({ group: this.Groups[i].name });
                    data[l].organisation = ' ';
                    for (let w = 0; w < requests_organisations.length; ++w) {
                        for (let n = 0; n < requests_organisations[w].length; ++n) {
                            if (this.Groups[i].students[k].id_request === +requests_organisations[w][n].id_request) {
                                data[l].student = this.Groups[i].students[k].name;
                                data[l].student_UID = this.Groups[i].students[k].uid;
                                if (requests_organisations[w][n].id_status === 1) {
                                    data[l].status = requests_organisations[w][n].id_status;
                                    data[l].organisation = requests_organisations[w][n].name_organisation;
                                    isStudentApply = true;
                                    break;
                                } else {
                                    data[l].organisation += requests_organisations[w][n].name_organisation + ', ';
                                    isStudentApply = true;
                                }
                            }
                        }
                    }
                    if (!isStudentApply) {
                        data[l].student = this.Groups[i].students[k].name;
                        data[l].student_UID = this.Groups[i].students[k].uid;
                        data[l].organisation = "Не записался";
                    }
                }
            }
        }
    }
    return data;
};

Model.prototype.getPracticeById = async function (selected_practice) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = "?id=" + selected_practice;
    let result = await fetch('/practice-by-practice-id' + info, params);
    let practice = await result.json();
    return practice;
};

Model.prototype.getGroups = async function () {
    let result = await fetch('/proxy/core/v1/groups');
    let list = await result.json();
    let groups = list._embedded.groups;
    return groups;
};

Model.prototype.getGroupsByPracticeId = async function (practice) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = "?id_practice=" + practice.id_practice;
    let result = await fetch('/groups-by-practice-id' + info, params);
    let groups_uids = await result.json();
    return groups_uids;
};

Model.prototype.getGroupsNameByGroupsUID = async function (uidsGroups) {
    let groups = [];
    for (let i = 0; i < uidsGroups.length; ++i) {
        for (let j = 0; j < this.Groups.length; ++j) {
            if (+uidsGroups[i].uid_group === this.Groups[j].uid_LDAP) {
                groups.push(this.Groups[j].name);
            }
        }
    }
    return groups;
};
/*получаем студентов из хранилища LDAP по ID группы*/
/*Model.prototype.getStudentsByGroupId = async function (groupID) {
  let result = await fetch('/proxy/core/v1/groups/' + groupID);
  let list = await result.json();
  let studentsList = list._embedded.students;
  return studentsList;
};*/

Model.prototype.getStudentsByUID = async function (students_info) {
    let students = [],
        urls = [];
    for (let i = 0; i < students_info.length; ++i) {
        urls.push('/proxy/core/v1/people/' + students_info[i].uid_student);
    }
    await Promise.all(urls.map(url => fetch(url).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
        const resLength = results.length;
        for (let i = 0; i < resLength; ++i) {
            students.push({
                displayName: results[i].displayName,
                group_name: results[i]._links.groups[0].name,
                group_UID: results[i]._links.groups[0].id,
                date_creation_request: students_info[i].date_creation,
                id_request: students_info[i].id_request,
                uid_student: students_info[i].uid_student,
                id_organisation: students_info[i].id_organisation
            });
        }
    });
    return students;
};

Model.prototype.getStudentsFromLDAP = async function () {
    let groups = await this.getGroups();
    let urls = [];
    for (let i = 0; i < groups.length; i++) {
        this.Groups.push(new Group(groups[i].id, groups[i].name));
        urls.push('/proxy/core/v1/groups/' + groups[i].id);
    }
    await this.getStudentsByGroupIds(urls);
};

Model.prototype.getStudentsByGroupIds = async function (urls) {
    await Promise.all(urls.map(url => fetch(url).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
        const resLength = results.length;
        for (let i = 0; i < resLength; i++) {
            let students = results[i]._embedded.students;
            const stLength = students.length;
            for (let j = 0; j < stLength; j++) {
                let student = {
                    'name': students[j].displayName,
                    'uid': students[j].uid
                };
                this.Groups[i].students.push(student);
            }
        }
    });
};

Model.prototype.getCurrentYear = function () {
    let date = new Date();
    let currentYear = date.getFullYear().toString();
    return currentYear;
};

Model.prototype.distributeGroupsByCourses = async function (currentYear) {
    this.Courses = [new Course('1'), new Course('2'), new Course('3'), new Course('4'), new Course('1 (мг)'), new Course('2 (мг)')];
    let date = new Date();
    let currentMonth = date.getMonth();
    if (+currentMonth < SEPTEMBER) {
        currentYear -= 1;
    }

    for (let i = 0; i < this.Groups.length; i++) {
        if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            if (this.Groups[i].name.indexOf("мг") !== -1) {
                this.Courses[masterFirstCourse].addGroup(this.Groups[i].name);
            } else {
                this.Courses[firstCourse].addGroup(this.Groups[i].name);
            }
        }
        currentYear--;
        if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            if (this.Groups[i].name.indexOf("мг") !== -1) {
                this.Courses[masterSecondCourse].addGroup(this.Groups[i].name);
            } else {
                this.Courses[secondCourse].addGroup(this.Groups[i].name);
            }
        }
        currentYear--;
        if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            if (this.Groups[i].name.indexOf("мг") === -1) {
                this.Courses[thirdCourse].addGroup(this.Groups[i].name);
            }
        }
        currentYear--;
        if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            if (this.Groups[i].name.indexOf("мг") === -1) {
                this.Courses[fourthCourse].addGroup(this.Groups[i].name);
            }
        }
        currentYear += 3;
    }
};
Model.prototype.getPractice = async function (info_about_practice) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    info_about_practice = "?year=" + info_about_practice.year + "&edu_level=" + info_about_practice.edu_level + "&typePractice=" + info_about_practice.typePractice;
    let info = 0;
    let result = await fetch('/practice' + info_about_practice, params).then(response => {
        info = response.json();
    }).catch(response => {
        console.log(response);
    });
    return info;
};
Model.prototype.getRequestByStudentUID = async function (practice, student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?uid=' + student.uid + "&id_practice=" + practice.id_practice;
    let result = await fetch('/requst-by-student-uid' + info, params);
    let request = await result.json();
    return request;
};

Model.prototype.updateIdOrganisationInRequest = async function (student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation;
    let result = await fetch('/update-request' + info, params);
};

Model.prototype.getRequests = async function (practice, groups) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let requests = [];
    let urls = [];
    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].students.length; j++) {
            let info = '?id_student=' + groups[i].students[j].uid + "&id_practice=" + practice.id_practice;
            urls.push('/requsts-by-student-practice' + info);
        }
    }

    await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
        for (let i = 0; i < results.length; ++i) {
            requests.push(results[i]);
        }
    });
    return requests; //получили all заявок студентов выбранных групп
};

Model.prototype.assosiateRequestToStudent = async function (requests, groups) {
    for (let i = 0; i < this.Groups.length; ++i) {
        for (let j = 0; j < groups.length; ++j) {
            if (this.Groups[i].name === groups[j]) {
                for (let k = 0; k < this.Groups[i].students.length; ++k) {
                    for (let n = 0; n < requests.length; ++n) {
                        if (this.Groups[i].students[k].uid === requests[n].uid_student) {
                            this.Groups[i].students[k].id_request = requests[n].id_request;
                            if (requests[n].id_organisation !== null) {
                                this.Groups[i].students[k].id_organisation = requests[n].id_organisation;
                            }
                        }
                    }
                }
            }
        }
    }
};

Model.prototype.getRequestsOrganisations = async function (selectedGroups) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let urls = [];
    let organisations_by_request = [];
    for (let i = 0; i < this.Groups.length; ++i) {
        for (let j = 0; j < selectedGroups.length; ++j) {
            if (this.Groups[i].name === selectedGroups[j]) {
                for (let k = 0; k < this.Groups[i].students.length; ++k) {
                    urls.push('/organisations-by-request' + '?id_request=' + this.Groups[i].students[k].id_request);
                }
            }
        }
    }
    await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
        for (let i = 0; i < results.length; ++i) {
            organisations_by_request.push(results[i]);
        }
    });
    return organisations_by_request;
};
Model.prototype.getRequestByStudentUIDS = async function (practice, students) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let urls = [];
    let requests = [];
    for (let i = 0; i < students.length; i++) {
        urls.push('/requst-by-student-uid' + '?uid=' + students[i].uid + "&id_practice=" + practice.id_practice);
    }
    await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
        for (let i = 0; i < results.length; ++i) {
            requests.push(results[i]);
        }
    });

    return requests;
};
Model.prototype.getPracticeYears = async function () {
    let result = await fetch('/years-practice');
    let years = await result.json();
    return years;
};
Model.prototype.getPractices = async function () {
    let result = await fetch('/all-practices');
    let practices = await result.json();
    return practices;
};
Model.prototype.getTypesPractices = async function () {
    let result = await fetch('/types-practices');
    let types_practices = await result.json();
    return types_practices;
};
Model.prototype.getRequestsOrganisationsByRequestId = async function (requests) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let urls = [];
    let requests_organisations = [];
    for (let i = 0; i < requests.length; i++) {
        urls.push('/organisations-by-request' + '?id_request=' + requests[i].id_request);
    }
    await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
        for (let i = 0; i < results.length; ++i) {
            requests_organisations.push(results[i]);
        }
    });

    return requests_organisations;
};

/*============================================PRACTICE CREATION
 SECTION=====================================================*/

Model.prototype.init = async function () {
    let subID = "57238bd9-36e8-4d84-8160-eb4ad957a841";
    let userToken = getUserToken(),
        user = 0;
    if (!userToken) {
        window.location = CONFIG.no_token_location;
    } else {
        // subID = JSON.parse(atob(userToken.split('.')[1])).sub;
        user = await this.getUserInfo(subID);
    }
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    /* let info = '?userType=' + user.typeUser;
     await fetch('/user-cabinet' + info, params);*/
    /*    if (user.typeUser === "Преподаватель"){
            window.location.assign('./index.html')
        } else {
            window.location.assign('./student_cabinet.html ')
        }*/
};

Model.prototype.getUserInfo = async function (subID) {
    let user = {};
    let result = await fetch('/proxy/core/v1/people/?uid=' + subID);
    let subject = await result.json();
    let type_user = subject._embedded.people["0"].title;
    if (type_user.length === 2) {
        type_user = subject._embedded.people["0"].title[1];
    }
    let givenName = subject._embedded.people["0"].givenName;
    let sn = subject._embedded.people["0"].sn;
    user.firstName = givenName;
    user.lastName = sn;
    user.typeUser = type_user;
    return user;
};

function getUserToken() {
    return localStorage.getItem('user-token');
}

Model.prototype.getTypesOrganisation = async function () {
    this.typesOrganisation = [];
    let result = await fetch('/types-organisation');
    let types = await result.json();
    this.typesOrganisation = types;
    return this.typesOrganisation;
};

Model.prototype.getOrganisations = async function () {
    let result = await fetch('/organisations');
    let orgs = await result.json();
    this.Organisations = orgs;
    return this.Organisations;
};

Model.prototype.getOrganisationsByPracticeId = async function (practice) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?id_practice=' + practice.id_practice;
    let result = await fetch('/organisations-by-practice' + info, params);
    let organisations = await result.json();
    return organisations;
};

Model.prototype.getOrganisationById = async function (id) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?id=' + id;
    let result = await fetch('/organisation-by-id' + info, params);
    let organisation = await result.json();
    return organisation;
};

Model.prototype.getRequestsByPracticeId = async function (practice) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?id_practice=' + practice.id_practice;
    let result = await fetch('/requests-by-practice' + info, params);
    let requests = await result.json();
    return requests;
};

Model.prototype.getRequestsByPracticeId_OrganisationId = async function (idPractice, idOrganisation) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?id_practice=' + idPractice + "&id_organisation=" + idOrganisation;
    let result = await fetch('/requests-by-idpractice-idorganisation' + info, params);
    let request = await result.json();
    if (request !== undefined) return request;else return 0;
};

Model.prototype.getRequestsByOrganisationId = async function (organisation, practice, isApproved) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = 0,
        STATUS;
    if (!isApproved) {
        info = "?id_practice=" + practice.id_practice;
        STATUS = 0;
    } else {
        info = "?id_practice=" + practice.id_practice + "&id_organisation=" + organisation.id;
        STATUS = 1;
    }
    let result = await fetch('/requests-by-practice' + info, params);
    let requests = await result.json();
    let students = [];
    let urls = [];
    for (let i = 0; i < requests.length; i++) {
        urls.push("/exist-request?id_request=" + requests[i].id_request + "&id_organisation=" + organisation.id);
    }
    await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
        const resLength = results.length;
        for (let i = 0; i < resLength; i++) {
            if (results[i] !== 'Not found') {
                if (results[i].id_status === STATUS) {
                    students.push({
                        id_request: results[i].id_request,
                        id_organisation: results[i].id_organisation,
                        id_status: results[i].id_status,
                        uid_student: requests[i].uid_student,
                        id_practice: requests[i].id_practice,
                        id_review: requests[i].id_review,
                        date_creation: results[i].date_creation
                    });
                }
            }
        }
    });
    return students;
};

Model.prototype.getOrganisationByName = async function (nameOrganisation) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?name=' + nameOrganisation;
    let result = await fetch('/organisation-by-name' + info, params);
    let organisation = await result.json();
    return organisation;
};

Model.prototype.getDeterminedGroups = async function (selectedGroups) {
    let determinedGroups = [];
    for (let i = 0; i < this.Groups.length; i++) {
        for (let j = 0; j < selectedGroups.length; j++) {
            if (this.Groups[i].name === selectedGroups[j]) {
                determinedGroups.push(this.Groups[i]);
            }
        }
    }
    return determinedGroups;
};

Model.prototype.createOrganisation = async function (organisation) {
    let result = await fetch('/organisation-create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(organisation)
    }).catch(function (error) {
        alert("Ошибка при добавлении организации в БД " + error);
    });
};

Model.prototype.updateOrganisation = async function (organisation) {
    let result = await fetch('/organisation-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(organisation)
    }).catch(function (error) {
        alert("Ошибка при добавлении организации в БД " + error);
    });
};

Model.prototype.createPractice = async function (practice) {
    let result = await fetch('/practice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(practice)
    }).catch(function (error) {
        alert("Ошибка при добавлении практики в БД " + error);
    });
};

Model.prototype.createOrUpdateStudents = async function (students) {
    let result = await fetch('/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(students)
    }).catch(function (error) {
        alert("Ошибка при добавлении uid студентов в БД " + error);
    });
};

Model.prototype.updateRequestOrganisation = async function (student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let date = new Date();
    var currentDate = date.format("yyyy-mm-dd");
    let info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation + "&id_status=" + student.id_status + "&date_creation=" + currentDate;
    await fetch('/update-request-organisation' + info, params);
};

Model.prototype.updateRequestsOrganisation = async function (students) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let urls = [];
    let date = new Date();
    var currentDate = date.format("yyyy-mm-dd");
    for (let i = 0; i < students.length; i++) {
        let info = '?id_request=' + students[i].id_request + "&id_organisation=" + students[i].id_organisation + "&id_status=" + students[i].id_status + "&date_creation=" + currentDate;
        urls.push('/update-request-organisation' + info);
    }

    await Promise.all(urls.map(url => fetch(url, params).catch(err => err)));
};

Model.prototype.updateRequestOrganisationByRequest = async function (student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };

    let info = '?id_request=' + student.id_request + "&id_status=" + student.id_status + "&id_organisation=" + student.id_organisation;
    await fetch('/update-request-organisation-by-request' + info, params);
};
Model.prototype.updateRequestsOrganisationByRequest = async function (students) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let urls = [];
    for (let i = 0; i < students.length; i++) {
        let info = '?id_request=' + students[i].id_request + "&id_organisation=" + students[i].id_organisation + "&id_status=" + students[i].id_status;
        urls.push('/update-request-organisation-by-request' + info);
    }
    await Promise.all(urls.map(url => fetch(url, params).catch(err => err)));
};
Model.prototype.insertRequestOrganisation = async function (student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let date = new Date();
    var currentDate = date.format("yyyy-mm-dd");
    let info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation + "&id_status=" + student.id_status + "&date_creation=" + currentDate;
    await fetch('/insert-request-organisation' + info, params);
};

Model.prototype.updateRequest = async function (student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = 0;
    if (student.id_status === REJECTED) {
        info = '?id_request=' + student.id_request + "&id_organisation=null";
    } else {
        info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation;
    }
    await fetch('/update-request' + info, params);
};
Model.prototype.updateRequests = async function (students) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = 0;
    let urls = [];

    for (let i = 0; i < students.length; i++) {
        let info = 0;
        if (students[i].id_status === REJECTED) {
            info = '?id_request=' + students[i].id_request + "&id_organisation=null";
        } else {
            info = '?id_request=' + students[i].id_request + "&id_organisation=" + students[i].id_organisation;
        }
        urls.push('/update-request' + info);
    }

    await Promise.all(urls.map(url => fetch(url, params).catch(err => err)));
};

Model.prototype.generateDocument = async function (document, type_document, type_practice) {
    let information = {
        data: document,
        type_document: type_document,
        type_practice: type_practice
    };
    let result = await fetch('/document', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(information)
    }).then(function (resp) {
        return resp.blob();
    }).then(function (blob) {
        saveAs(blob, type_document + ' ' + type_practice + ' практика ' + document.group_name + ".docx");
    }).catch(function (error) {
        alert("Ошибка при генерации документа " + error);
    });
    debugger;
};
module.exports = Model;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    "server_port": 7777,
    "use_proxy": false,
    "supervisor_path": "/supervisor_cabinet",
    "student_path": "/student_cabinet",
    "no_token_location": "http://esb.iipo.tu-bryansk.ru/authentication/?redirect=http://esb.iipo.tu-bryansk.ru/practice/",
    "origin_location": "/practice/",
    "db": "practice",
    "proxy": "http://esb.iipo.tu-bryansk.ru"
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = [{"name":"МОА","fullName":"02.03.03 «Математическое обеспечение и администрирование информационных систем»","profile":"«Технология программирования»","type":"Бакалавриат"},{"name":"ПРИ","fullName":"09.03.04 «Программная инженерия»","profile":"«Разработка программно-информационных систем»","type":"Бакалавриат"},{"name":"ИВТ-1","fullName":"09.03.01 «Информатика и вычислительная техника»","profile":"«Программное обеспечение вычислительной техники и автоматизированных систем»","type":"Бакалавриат"},{"name":"ИВТ-2","fullName":"09.03.01 «Информатика и вычислительная техника»","profile":"«Программное обеспечение вычислительной техники и автоматизированных систем»","type":"Бакалавриат"},{"name":"ИВТ-3","fullName":"09.03.01 «Информатика и вычислительная техника»","profile":"«Программное обеспечение вычислительной техники и автоматизированных систем»","type":"Бакалавриат"},{"name":"ПРИ (мг)","fullName":"09.04.04 «Программная инженерия»","profile":"«Проектирование программно-информационных систем»","type":"Магистратура"},{"name":"ИВТ-1 (мг)","fullName":"09.04.01 «Информатика и вычислительная техника»","profile":"«Компьютерный анализ и интерпретация данных»","type":"Магистратура"},{"name":"ИВТ-2 (мг)","fullName":"09.04.01 «Информатика и вычислительная техника»","profile":"«Информационное и программное обеспечение вычислительных систем»","type":"Магистратура"},{"name":"БАС","fullName":"09.04.01 «Информатика и вычислительная техника»","profile":"«Информационное и программное обеспечение вычислительных систем»","type":"Бакалавриат"}]

/***/ }),
/* 12 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDc0ZGUwZmZlMGVkNWRlYmFiOTk2Iiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vL2NvbmZpZy9yZWxfY29uZmlnLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvYXNzZXRzL2pzb24vZGF0YS5qc29uIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3NGRlMGZmZTBlZDVkZWJhYjk5NiIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlKCcuL2Fzc2V0cy9qc29uL2RhdGEuanNvbicpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gIG5ldyBDb250cm9sbGVyKCk7XHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvbWFpbi5qcyIsImNvbnN0IFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcuanMnKTtcclxuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL01vZGVsLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBDb250cm9sbGVyKCkge1xyXG4gICAgdGhpcy5WaWV3ID0gbmV3IFZpZXcoKTtcclxuICAgIHRoaXMuTW9kZWwgPSBuZXcgTW9kZWwoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG5jb25zdCBBUFBST1ZFRCA9IDE7XHJcbmNvbnN0IFJFSkVDVEVEID0gMjtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5pbml0KCk7XHJcbiAgICBhd2FpdCB0aGlzLnNldFllYXJzKCk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja05leHRTdGVwRGlzcGxheUdyb3Vwc1RyZWVWaWV3ID0gdGhpcy5kaXNwbGF5R3JvdXBzLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZVByYWN0aWNlID0gdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBZGRQcmFjdGljZSA9IHRoaXMuY3JlYXRlUHJhY3RpY2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IHRoaXMuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0ZpbmlzaEJ0biA9IHRoaXMuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gdGhpcy5yZW5kZXJEYXRhSW5UYWJsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tZZWFyc0FycmF5ID0gdGhpcy5zZXRHcm91cHNUcmVlVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRPcmdhbmlzYXRpb25zSW5DdXJyZW50UHJhY3RpY2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uID0gdGhpcy51cGRhdGVUcmVlVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnID0gdGhpcy5kaXNwbGF5SW5mb0Fib3V0T3JnLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRWRpdE9yZ2FuaXNhdGlvbiA9IHRoaXMuc2hvd0RpYWxvZ0VkaXRPcmdhbmlzYXRpb24uYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uID0gdGhpcy51cGRhdGVPcmdhbmlzYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQXBwcm92ZVN0dWRlbnQgPSB0aGlzLmNoYW5nZVN0dWRlbnRTdGF0dXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrUmVqZWN0U3R1ZGVudCA9IHRoaXMuY2hhbmdlU3R1ZGVudFN0YXR1cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nID0gdGhpcy5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbiA9IHRoaXMuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1Nob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50ID0gdGhpcy5zaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudC5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tHZW5lcmF0ZURvY3VtZW50ID0gdGhpcy5nZW5lcmF0ZURvY3VtZW50LmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DaGFuZ2VUeXBlRG9jdW1lbnQgPSB0aGlzLmluaXREaWFsb2cuYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5pbml0KCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmdldFN0dWRlbnRzRnJvbUxEQVAoKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09R0VORVJBVEUgRE9DVU1FTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5pbml0RGlhbG9nID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVfZG9jdW1lbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0VmFsdWUoXCJnZHR5cGVEb2N1bWVudFwiKTtcclxuICAgIGxldCBpc09yZGVyID0gZmFsc2U7XHJcbiAgICBpZiAodHlwZV9kb2N1bWVudCA9PT0gXCLQn9GA0LjQutCw0LdcIikge1xyXG4gICAgICAgIGlzT3JkZXIgPSB0cnVlO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlSW5wdXRzKGlzT3JkZXIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaXNPcmRlciA9IGZhbHNlO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlSW5wdXRzKGlzT3JkZXIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlSW5wdXRzID0gYXN5bmMgZnVuY3Rpb24gKGlzT3JkZXIpIHtcclxuICAgIGxldCBzZWxlY3RlZFByYWN0aWNlID0gYXdhaXQgdGhpcy5WaWV3LmdldFNlbGVjdGVkUHJhY3RpY2UoXCJmb3JTdHVkZW50c1NlY3Rpb25cIilbMF07XHJcbiAgICBsZXQgZ3JvdXBzPXNlbGVjdGVkUHJhY3RpY2UuZ3JvdXBzLnNwbGl0KCcsJyk7XHJcbiAgICBpZiAoaXNPcmRlcikgey8v0L/RgNC40LrQsNC3XHJcbiAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5WaWV3LmdldEVsZW1CeUlkKFwiZ3JvdXBzLXJlcG9ydC1ibG9ja1wiKTtcclxuICAgICAgICB0aGlzLlZpZXcucmVtb3ZlQ2hpbGRyZW4oYmxvY2spO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VEaXNwbGF5KFwicmVwb3J0LWJsb2NrXCIsIFwibm9uZVwiKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcIm9yZGVyLWJsb2NrXCIsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgdGhpcy5WaWV3LmNyZWF0ZUlucHV0c09yZGVyKGdyb3Vwcyk7XHJcbiAgICAgICAgdGhpcy5WaWV3LmNoYW5nZUlubmVySHRtbChcInR5cGVEb2N1bWVudFwiLCBcItC/0YDQuNC60LDQt9CwXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7Ly/QvtGC0YfQtdGCXHJcbiAgICAgICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZUJ5SWQoc2VsZWN0ZWRQcmFjdGljZS5pZCk7XHJcbiAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5WaWV3LmdldEVsZW1CeUlkKFwib3JkZXItYmxvY2tcIik7XHJcbiAgICAgICAgdGhpcy5WaWV3LnJlbW92ZUNoaWxkcmVuKGJsb2NrKTtcclxuICAgICAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzUmVwb3J0KGdyb3Vwcyk7XHJcbiAgICAgICAgdGhpcy5WaWV3LmNoYW5nZURpc3BsYXkoXCJyZXBvcnQtYmxvY2tcIiwgXCJibG9ja1wiKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcIm9yZGVyLWJsb2NrXCIsIFwibm9uZVwiKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlSW5uZXJIdG1sKFwidHlwZURvY3VtZW50XCIsIFwi0L7RgtGH0LXRgtCwXCIpO1xyXG4gICAgICAgIGxldCBvcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICAgICAgICB0aGlzLlZpZXcuZmlsbERpYWxvZyhwcmFjdGljZSwgb3JnYW5pc2F0aW9ucyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBwcmFjdGljZT10aGlzLlZpZXcuZ2V0U2VsZWN0ZWRQcmFjdGljZShcImZvclN0dWRlbnRzU2VjdGlvblwiKTtcclxuICAgIGlmKHByYWN0aWNlLmxlbmd0aCE9PTApe1xyXG4gICAgICAgIHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZUJ5SWQocHJhY3RpY2VbMF0uaWQpO1xyXG4gICAgICAgIGlmKHByYWN0aWNlLmlkX3R5cGVfcHJhY3RpY2U9PT0yIHx8IHByYWN0aWNlLmlkX3R5cGVfcHJhY3RpY2U9PT0zKXtcclxuICAgICAgICAgICAgYWxlcnQoXHJcbiAgICAgICAgICAgICAgICBcItCS0L7Qt9C80L7QttC90L7RgdGC0Ywg0LPQtdC90LXRgNCw0YbQuNC4INC00L7QutGD0LzQtdC90YLQvtCyINC00LvRjyDQv9GA0LXQtNC00LjQv9C70L7QvNC90L7QuSDQv9GA0LDQutGC0LjQutC4INC4INC90LDRg9GH0L3Qvi3QuNGB0YHQu9C10LTQvtCy0LDRgtC10LvRjNGB0LrQuNC5INGA0LDQsdC+0YLRiyDQsiDRgdGC0LDQtNC40Lgg0YDQsNC30YDQsNCx0L7RgtC60LguINCf0YDQuNC90L7RgdC40Lwg0YHQstC+0Lgg0LjQt9Cy0LjQvdC10L3QuNGPINC30LAg0L/RgNC10LTQvtGB0YLQsNCy0LvQtdC90L3Ri9C1INC90LXRg9C00L7QsdGB0YLQstCwLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLlZpZXcuZGlhbG9nT3BlbihcIiNkaWFsb2dHZW5lcmF0ZVJlcG9ydFwiKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KFxyXG4gICAgICAgICAgICBcItCf0YDQsNC60YLQuNC60LAg0L3QtSDQstGL0LHRgNCw0L3QsC4g0JLRi9Cx0LXRgNC40YLQtSDQv9GA0LDQutGC0LjQutGDLlwiKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdlbmVyYXRlRG9jdW1lbnQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBhd2FpdCB0aGlzLlZpZXcucmVhZFRleHRGaWxlKFwiL2pzL2Fzc2V0cy9qc29uL2RhdGEuanNvblwiLCBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZSh0ZXh0KTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0pO1xyXG4gICAgbGV0IHNlbGVjdGVkUHJhY3RpY2U9dGhpcy5WaWV3LmdldFNlbGVjdGVkUHJhY3RpY2UoXCJmb3JTdHVkZW50c1NlY3Rpb25cIilbMF07XHJcbiAgICBsZXQgZ3JvdXBzPXNlbGVjdGVkUHJhY3RpY2UuZ3JvdXBzLnNwbGl0KCcsJyk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlQnlJZChzZWxlY3RlZFByYWN0aWNlLmlkKTtcclxuICAgIGxldCB0eXBlX2RvY3VtZW50ID0gdGhpcy5WaWV3LmdldFNlbGVjdFZhbHVlKFwiZ2R0eXBlRG9jdW1lbnRcIik7XHJcbiAgICBsZXQgZG9jdW1lbnRzID0gMCwgZGF0YSA9IDA7XHJcblxyXG4gICAgaWYgKHR5cGVfZG9jdW1lbnQgPT09IFwi0J/RgNC40LrQsNC3XCIpIHtcclxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5nZXRQcmVmZXJlbmNlc1N0dWRlbnRzT3JnYW5pc2F0aW9ucyhzZWxlY3RlZFByYWN0aWNlKTtcclxuICAgICAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XHJcbiAgICAgICAgZG9jdW1lbnRzID0gdGhpcy5WaWV3LmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRPcmRlcihwcmFjdGljZSwgZ3JvdXBzLCB0aGlzLk1vZGVsLkdyb3VwcywgZGF0YSwgb3JnYW5pc2F0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XHJcbiAgICAgICAgZG9jdW1lbnRzID0gdGhpcy5WaWV3LmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRSZXBvcnQocHJhY3RpY2UsIGdyb3VwcywgdGhpcy5Nb2RlbC5Hcm91cHMsIG9yZ2FuaXNhdGlvbnMpO1xyXG5cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG9jdW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5Nb2RlbC5nZW5lcmF0ZURvY3VtZW50KGRvY3VtZW50c1tpXSwgdHlwZV9kb2N1bWVudCwgcHJhY3RpY2UuaWRfdHlwZV9wcmFjdGljZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG4gICAgdGhpcy5WaWV3LmNsZWFyUHJhY3RpY2VTZWN0aW9uKCk7XHJcbiAgICBsZXQgdHlwZXNPcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbiAgICB0aGlzLlZpZXcuc2V0VHlwZXNPcmdhbmlzYXRpb25TZWxlY3QodHlwZXNPcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3LmdvVG9QcmFjdGljZUNyZWF0aW9uKCk7XHJcbiAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5kaXNwbGF5R3JvdXBzKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVRyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgYXdhaXQgdGhpcy5jcmVhdGVOZXdPcmdhbmlzYXRpb24oKTtcclxuICAgIGF3YWl0IHRoaXMudXBkYXRlVHlwZXNPcmdhbmlzYXRpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSB0aGlzLlZpZXcuUHJhY3RpY2U7XHJcbiAgICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREZXRlcm1pbmVkR3JvdXBzKHByYWN0aWNlLmdyb3Vwcyk7XHJcbiAgICBwcmFjdGljZS5ncm91cHMgPSBncm91cHM7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZVByYWN0aWNlKHByYWN0aWNlKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG4gICAgYXdhaXQgIHRoaXMuc2V0WWVhcnMoKTtcclxuICAgIHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVHlwZXNPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdHlwZXNPcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldFR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbiAgICB0aGlzLlZpZXcuY2xlYXJUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uKHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zKCk7XHJcbiAgICB0aGlzLlZpZXcuc2V0T3JnYW5pc2F0aW9uc0luVHJlZVZpZXcob3JnYW5pc2F0aW9ucywgdHlwZXNPcmdhbmlzYXRpb24pO1xyXG4gICAgcmV0dXJuIHR5cGVzT3JnYW5pc2F0aW9uO1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0WWVhcnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgeWVhcnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlWWVhcnMoKTtcclxuICAgIHRoaXMuVmlldy5zZXRZZWFyc0FycmF5KHllYXJzKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmRpc3RyaWJ1dGVHcm91cHNCeUNvdXJzZXModGhpcy5WaWV3LnNlbGVjdGVkWWVhcik7XHJcbiAgICBhd2FpdCB0aGlzLlZpZXcuY2xlYXJHcm91cHNUcmVlVmlldygpO1xyXG4gICAgYXdhaXQgdGhpcy5WaWV3LnVwZGF0ZUdyb3Vwc1RyZWVWaWV3KHRoaXMuTW9kZWwuQ291cnNlcywgdGhpcy5Nb2RlbC5Hcm91cHMpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyUHJhY3RpY2VUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGF3YWl0IHRoaXMuVmlldy5jbGVhclByYWN0aWNlVHJlZVZpZXcoKTtcclxuICAgIGxldCBwcmFjdGljZXMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlcygpO1xyXG4gICAgbGV0IHR5cGVzX3ByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc1ByYWN0aWNlcygpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmFjdGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9PT0gcHJhY3RpY2VzW2ldLnllYXIpIHtcclxuICAgICAgICAgICAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzQnlQcmFjdGljZUlkKHByYWN0aWNlc1tpXSk7XHJcbiAgICAgICAgICAgIGdyb3VwcyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzTmFtZUJ5R3JvdXBzVUlEKGdyb3Vwcyk7XHJcbiAgICAgICAgICAgIHByYWN0aWNlc1tpXS5ncm91cHMgPSBncm91cHMuam9pbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuVmlldy5zZXRQcmFjdGljZXNJblRyZWVWaWV3KHByYWN0aWNlcywgdHlwZXNfcHJhY3RpY2UpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0R3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHRoaXMuVmlldy51cGRhdGVZZWFyKGV2ZW50KTtcclxuICAgIGlmICh0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID09PSBcIitcIikge1xyXG4gICAgICAgIHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPSB0aGlzLk1vZGVsLmdldEN1cnJlbnRZZWFyKCk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJQcmFjdGljZVRyZWVWaWV3KCk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0aGlzLnJlbmRlckdyb3Vwc1RyZWVWaWV3KCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRQcmVmZXJlbmNlc1N0dWRlbnRzT3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZFByYWN0aWNlKSB7XHJcbiAgICBsZXQgZ3JvdXBzT2JqZWN0cyA9IFtdO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZUJ5SWQoc2VsZWN0ZWRQcmFjdGljZS5pZCk7XHJcbiAgICBwcmFjdGljZS5ncm91cHMgPSBzZWxlY3RlZFByYWN0aWNlLmdyb3Vwcy5zcGxpdCgnLCcpO1xyXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBwcmFjdGljZS5ncm91cHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuTW9kZWwuR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmFjdGljZS5ncm91cHNba10gPT09IHRoaXMuTW9kZWwuR3JvdXBzW2pdLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc09iamVjdHMucHVzaCh0aGlzLk1vZGVsLkdyb3Vwc1tqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzKHByYWN0aWNlLCBncm91cHNPYmplY3RzKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudChyZXF1ZXN0cywgcHJhY3RpY2UuZ3JvdXBzKTtcclxuICAgIGxldCByZXF1ZXN0c19vcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnMocHJhY3RpY2UuZ3JvdXBzKTtcclxuICAgIGxldCBkYXRhID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREYXRhKHByYWN0aWNlLmdyb3VwcywgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucyk7XHJcbiAgICByZXR1cm4gZGF0YTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckRhdGFJblRhYmxlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgbGV0IHByYWN0aWNlcyA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZFByYWN0aWNlKFwiZm9yU3R1ZGVudHNTZWN0aW9uXCIpO1xyXG4gICAgaWYocHJhY3RpY2VzLmxlbmd0aCE9PTApIHtcclxuICAgICAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlQnlJZChwcmFjdGljZXNbMF0uaWQpO1xyXG4gICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLmdldFByZWZlcmVuY2VzU3R1ZGVudHNPcmdhbmlzYXRpb25zKHByYWN0aWNlc1swXSk7XHJcblxyXG4gICAgICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZShkYXRhKTtcclxuICAgICAgICB0aGlzLlZpZXcuY29sb3JUYWJsZShkYXRhKTtcclxuICAgICAgICB0aGlzLlZpZXcucmVuZGVySW5mbyhwcmFjdGljZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhbGVydChcItCf0YDQsNC60YLQuNC60LAg0L3QtSDQstGL0LHRgNCw0L3QsC4g0JLRi9Cx0LXRgNC40YLQtSDQv9GA0LDQutGC0LjQutGDLlwiKTtcclxuICAgIH1cclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09T1JHQU5JU0FUSU9OUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcImFsbE9yZ2FuaXNhdGlvbnNMaXN0XCIpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRQcmFjdGljZShcImZvck9yZ2FuaXNhdGlvblNlY3Rpb25cIilbMF07XHJcbiAgICBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2VCeUlkKHByYWN0aWNlLmlkKTtcclxuICAgIGxldCBhcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gMCwgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQgPSAwO1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGFwcHJvdmVkX3N0dWRlbnRfY291bnQgPSBhd2FpdCB0aGlzLnJlbmRlclN0dWRlbnRMaXN0KG9yZ2FuaXNhdGlvbixcclxuICAgICAgICAgICAgcHJhY3RpY2UsIFwiYXBwcm92ZWRTdHVkZW50c1wiKTtcclxuICAgICAgICBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IGF3YWl0IHRoaXMucmVuZGVyU3R1ZGVudExpc3Qob3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICBwcmFjdGljZSwgXCJub25BcHByb3ZlZFN0dWRlbnRzXCIpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5WaWV3LnVwZGF0ZU9yZ2FuaXNhdGlvblRpdGxlKG9yZ2FuaXNhdGlvbi5uYW1lLCBhcHByb3ZlZF9zdHVkZW50X2NvdW50LFxyXG4gICAgICAgIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50KTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpc3BsYXlJbmZvQWJvdXRPcmcgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkT3JnYW5pc2F0aW9uKGV2ZW50KTtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZShuYW1lT3JnYW5pc2F0aW9uKTtcclxuICAgIGF3YWl0IHRoaXMuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJTdHVkZW50TGlzdCA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24sIHByYWN0aWNlLCBpZExpc3QpIHtcclxuICAgIGxldCBzdGF0dXM7XHJcbiAgICBpZiAoaWRMaXN0ID09PSBcImFwcHJvdmVkU3R1ZGVudHNcIikge1xyXG4gICAgICAgIHN0YXR1cyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzdGF0dXMgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGxldCBzdHVkZW50c0luZm8gPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzQnlPcmdhbmlzYXRpb25JZChcclxuICAgICAgICBvcmdhbmlzYXRpb24sIHByYWN0aWNlLCBzdGF0dXMpO1xyXG4gICAgbGV0IHN0dWRlbnRzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRTdHVkZW50c0J5VUlEKHN0dWRlbnRzSW5mbyk7XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlU3R1ZGVudHNMaXN0VmlldyhzdHVkZW50cywgaWRMaXN0KTtcclxuICAgIHJldHVybiBzdHVkZW50cy5sZW5ndGg7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zSW5DdXJyZW50UHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5WaWV3LmdldFNlbGVjdGVkUHJhY3RpY2UoXCJmb3JPcmdhbmlzYXRpb25TZWN0aW9uXCIpWzBdO1xyXG4gICAgaWYocHJhY3RpY2UhPT11bmRlZmluZWQpIHtcclxuICAgICAgICBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2VCeUlkKHByYWN0aWNlLmlkKTtcclxuICAgICAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IDA7XHJcbiAgICAgICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICBvcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdHNfbnVtYmVyID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0c0J5UHJhY3RpY2VJZF9PcmdhbmlzYXRpb25JZChwcmFjdGljZS5pZF9wcmFjdGljZSwgb3JnYW5pc2F0aW9uc1tpXS5pZCk7XHJcbiAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW2ldLm51bV92YWNhbnRfcGxhY2VzID0gb3JnYW5pc2F0aW9uc1tpXS5tYXhfc3R1ZGVudHNfbnVtYmVyIC0gcmVxdWVzdHNfbnVtYmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcIm9yZ2FuaXNhdGlvbkxpc3RcIik7XHJcbiAgICAgICAgdGhpcy5WaWV3LnJlbmRlck9yZ2FuaXNhdGlvblNlY3Rpb24ocHJhY3RpY2UpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICBhbGVydChcItCf0YDQsNC60YLQuNC60LAg0L3QtSDQstGL0LHRgNCw0L3QsC4g0JLRi9Cx0LXRgNC40YLQtSDQv9GA0LDQutGC0LjQutGDLlwiKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25CeVRpdGxlKCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY2hhbmdlU3R1ZGVudFN0YXR1cyA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgICBsZXQgc3R1ZGVudCA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZFN0dWRlbnQoZXZlbnQpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uKHN0dWRlbnQpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0KHN0dWRlbnQpO1xyXG5cclxuICAgIHN0dWRlbnRbJ2lkX3N0YXR1cyddID0gUkVKRUNURUQ7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb25CeVJlcXVlc3Qoc3R1ZGVudCk7XHJcblxyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuZ2V0T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS51cGRhdGVPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldEluZm9OZXdPcmdhbmlzYXRpb24oKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVOZXdPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldEluZm9OZXdPcmdhbmlzYXRpb24oKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuY3JlYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRQcmFjdGljZShcImZvck9yZ2FuaXNhdGlvblNlY3Rpb25cIilbMF07XHJcbiAgICBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2VCeUlkKHByYWN0aWNlLmlkKTtcclxuICAgIGxldCB1aWRzR3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgbGV0IG5hbWVzR3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNOYW1lQnlHcm91cHNVSUQodWlkc0dyb3Vwcyk7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nRW5hYmxlQ2hlY2tib3hlcyhuYW1lc0dyb3VwcyxcclxuICAgICAgICBcImdyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvclwiKTtcclxuICAgIHRoaXMuVmlldy5kaWFsb2dFbmFibGVDaGVja2JveGVzKG5hbWVzR3JvdXBzLFxyXG4gICAgICAgIFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlclwiKTtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uPXRoaXMuVmlldy5nZXRPbkNsaWNrTmFtZU9yZ2FuaXNhdGlvbihldmVudCk7XHJcbiAgICB0aGlzLlZpZXcuY2hhbmdlSW5uZXJIdG1sKFwibmFtZU9yZ2FuaXNhdGlvbkRpYWxvZ1wiLG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ09wZW4oXCIjZGlhbG9nQWRkU3R1ZGVudFwiKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzdHVkZW50cyA9IGF3YWl0IHRoaXMuVmlldy5nZXRTZWxlY3RlZFN0dWRlbnRzKGV2ZW50KTtcclxuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuVmlldy5nZXRTZWxlY3RlZFByYWN0aWNlKFwiZm9yT3JnYW5pc2F0aW9uU2VjdGlvblwiKVswXTtcclxuICAgIHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZUJ5SWQocHJhY3RpY2UuaWQpO1xyXG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0TmFtZU9yZ2FuaXNhdGlvbkluVHJlZXZpZXcoXHJcbiAgICAgICAgXCJvcmdhbmlzYXRpb25MaXN0XCIpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gICAgbGV0IHJlcXVlc3RzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0QnlTdHVkZW50VUlEUyhwcmFjdGljZSxcclxuICAgICAgICBzdHVkZW50cyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZXF1ZXN0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc3R1ZGVudHNbaV0udWlkID09PSByZXF1ZXN0c1tqXS51aWRfc3R1ZGVudCkge1xyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX3JlcXVlc3QnXSA9IHJlcXVlc3RzW2pdLmlkX3JlcXVlc3Q7XHJcbiAgICAgICAgICAgICAgICBzdHVkZW50c1tpXVsnaWRfcHJhY3RpY2UnXSA9IHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX29yZ2FuaXNhdGlvbiddID0gb3JnYW5pc2F0aW9uLmlkO1xyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX3N0YXR1cyddID0gQVBQUk9WRUQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uKHN0dWRlbnRzKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdHMoc3R1ZGVudHMpO1xyXG5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3R1ZGVudHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBzdHVkZW50c1tqXVsnaWRfc3RhdHVzJ10gPSBSRUpFQ1RFRDtcclxuICAgIH1cclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdHNPcmdhbmlzYXRpb25CeVJlcXVlc3Qoc3R1ZGVudHMpO1xyXG4gICAgYXdhaXQgdGhpcy5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMob3JnYW5pc2F0aW9uKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNob3dEaWFsb2dFZGl0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgaWRPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0SWRPcmdhbmlzYXRpb24oZXZlbnQpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlJZChpZE9yZ2FuaXNhdGlvbik7XHJcbiAgICB0aGlzLlZpZXcuc2hvd0RpYWxvZ09yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvQ29udHJvbGxlci5qcyIsImNvbnN0IGJhY2hlbG9yWWVhciA9IDQ7XHJcbmNvbnN0IG1hc3RlclllYXIgPSA2O1xyXG5sZXQgc2VsZWN0ZWRFbGVtID0gMDtcclxuXHJcbnZhciBWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5pbmZvR3JvdXBzID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja05leHRTdGVwRGlzcGxheUdyb3Vwc1RyZWVWaWV3ID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0FkZFByYWN0aWNlID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrRmluaXNoQnRuID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSBudWxsO1xyXG4gICAgdGhpcy5teVRhYmxlID0gJCgnI3N0dWRlbnRzTGlzdFRhYmxlJyk7XHJcbiAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5ID0gbnVsbDtcclxuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0gbnVsbDtcclxuICAgIHRoaXMuaWRUcmVlVmlld3MgPSBbXHJcbiAgICAgICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1iYWNoZWxvcicsXHJcbiAgICAgICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1tYXN0ZXInLFxyXG4gICAgICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMS1kaWFsb2dBZGQtYmFjaGVsb3InLFxyXG4gICAgICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyJ1xyXG4gICAgXTtcclxuICAgIHRoaXMuaWRUcmVlVmlld3NQcmFjdGljZSA9IFtcclxuICAgICAgICAndHlwZXMtcHJhY3RpY2UtdHJlZXZpZXcnLFxyXG4gICAgICAgICd0eXBlcy1wcmFjdGljZS10cmVldmlldy1vcmdhbmlzYXRpb24tc2VjdGlvbidcclxuICAgIF07XHJcbiAgICB0aGlzLm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0VkaXRPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQXBwcm92ZVN0dWRlbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrUmVqZWN0U3R1ZGVudCA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tVcGRhdGVPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2hhbmdlVHlwZURvY3VtZW50ID0gbnVsbDtcclxuICAgIHRoaXMuUHJhY3RpY2UgPSBudWxsO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tbmV4dFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXBEaXNwbGF5R3JvdXBzVHJlZVZpZXcpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2Vzc1wiKS5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI3ByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0ZpbmlzaEJ0bik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldEdyb3Vwc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5MVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE9yZ2FuaXNhdGlvbnNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJhY3RpY2VGaW5pc2hlZE9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tBZGRQcmFjdGljZSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dBbGxPcmdhbmlzYXRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkU3R1ZGVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnRCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAnY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1Nob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGVEb2N1bWVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZVR5cGVEb2N1bWVudCk7XHJcblxyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSh7XHJcbiAgICAgICAgZGF0YTogdGhpcy5Hcm91cHMsXHJcbiAgICAgICAgXCJsYW5ndWFnZVwiOiB7XHJcbiAgICAgICAgICAgIFwiemVyb1JlY29yZHNcIjogXCLQotCw0LrQvtC5INC30LDQv9C40YHQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiLFxyXG4gICAgICAgICAgICBcImVtcHR5VGFibGVcIjogXCLQndC4INC+0LTQvdCwINC40Lcg0LPRgNGD0L/QvyDQvdC1INCy0YvQsdGA0LDQvdCwINC70LjQsdC+INC/0YDQsNC60YLQuNC60Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgICAgICAgXCJzZWFyY2hcIjogXCLQn9C+0LjRgdC6OlwiLFxyXG4gICAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZmlyc3RcIjogXCLQn9C10YDQstGL0LlcIixcclxuICAgICAgICAgICAgICAgIFwibGFzdFwiOiBcItCf0L7RgdC70LXQtNC90LjQuVwiLFxyXG4gICAgICAgICAgICAgICAgXCJuZXh0XCI6IFwi0JLQv9C10YDQtdC0XCIsXHJcbiAgICAgICAgICAgICAgICBcInByZXZpb3VzXCI6IFwi0J3QsNC30LDQtFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IFwiKNC40LcgX01BWF8g0YHRgtGD0LTQtdC90YLQvtCyKVwiLFxyXG4gICAgICAgICAgICBcImxlbmd0aE1lbnVcIjogXCLQn9C+0LrQsNC30LDRgtGMIF9NRU5VXyDQt9Cw0L/QuNGB0LXQuVwiLFxyXG4gICAgICAgICAgICBcImluZm9cIjogXCLQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0YLRg9C00LXQvdGC0L7QsjogX1RPVEFMXyBcIixcclxuICAgICAgICAgICAgXCJpbmZvRW1wdHlcIjogXCLQktGL0LHQtdGA0LjRgtC1INCz0YDRg9C/0L/Rgy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJjb2x1bW5zXCI6IFtcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcImdyb3VwXCJ9LFxyXG4gICAgICAgICAgICB7XCJkYXRhXCI6IFwic3R1ZGVudFwifSxcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcIm9yZ2FuaXNhdGlvblwifVxyXG4gICAgICAgIF1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgbGV0IHRyZWVWaWV3cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmVldmlld1wiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdHJlZVZpZXdzW2ldLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1JlcXVlc3RzXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RCbG9ja1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvUHJhY3RpY2VDcmVhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICBcInRydWVcIik7XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblZpZXcucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZmluaXNoQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF07XHJcbiAgICBmaW5pc2hCdG4uc2V0QXR0cmlidXRlKFwib25jbGlja1wiLFxyXG4gICAgICAgIFwibWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ1ByYWN0aWNlQ29tcGxldGVTdWNjZXNzJylcIik7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdWNhdGlvblwiKS52YWx1ZTtcclxuICAgIGlmIChlZHVjYXRpb25MZXZlbCA9PT0gXCJiYWNoZWxvclwiKSB7XHJcbiAgICAgICAgZWR1Y2F0aW9uTGV2ZWwgPSBcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGVkdWNhdGlvbkxldmVsID0gXCLQnNCw0LPQuNGB0YLRgNCw0YLRg9GA0LBcIjtcclxuICAgIH1cclxuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVwiKS52YWx1ZTtcclxuXHJcbiAgICBsZXQgbGVjTnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1cIikudmFsdWU7XHJcbiAgICBsZXQgZnJvbURhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIikudmFsdWU7XHJcbiAgICBsZXQgbnVtV2Vla3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRleHRXZWVrc1wiKS5pbm5lckhUTUw7XHJcbiAgICBsZXQgdG9EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZSArICcgJyArIG51bVdlZWtzO1xyXG4gICAgbGV0IGRlYWRsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVybXNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSAnYyAnICsgZnJvbURhdGVcclxuICAgICAgICArICcg0L/QviAnICsgdG9EYXRlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGRlYWRsaW5lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBmcm9tRGF0ZVxyXG4gICAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcbiAgICBpZiAoZnJvbURhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IGZyb21EYXRlLnN1YnN0cig4LCA0KSArICctJyArIGZyb21EYXRlLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICAgICArIGZyb21EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICAgIH1cclxuICAgIGlmICh0b0RhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICB0b0RhdGUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdG9EYXRlID0gdG9EYXRlLnN1YnN0cig4LCA0KSArICctJyArIHRvRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyB0b0RhdGUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYWRsaW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBkZWFkbGluZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBkZWFkbGluZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyBkZWFkbGluZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRyZWVWaWV3ID0gbnVsbDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJwcmFjdGljZVwiKSAhPT0gLTFcclxuICAgICAgICAgICAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheVxyXG4gICAgICAgICAgICA9PT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgICAgIHRyZWVWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGFyckdyb3VwcyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHModHJlZVZpZXcpO1xyXG4gICAgbGV0IGFyck9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eXBlUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJlZHVjYXRpb25hbExldmVsRGlhbG9nXCIpLmlubmVySFRNTCA9IGVkdWNhdGlvbkxldmVsO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJHcm91cHM7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcIm9yZ2FuaXNhdGlvbnNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJPcmdhbmlzYXRpb25zO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VcclxuICAgICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bURpYWxvZ1wiKS5pbm5lckhUTUwgPSBsZWNOdW07XHJcbiAgICB0aGlzLlByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgJ3N0YXJ0RGF0ZVByYWN0aWNlJzogZnJvbURhdGUsXHJcbiAgICAgICAgJ2VuZERhdGVQcmFjdGljZSc6IHRvRGF0ZSxcclxuICAgICAgICAnZGVhZGxpbmVQcmFjdGljZSc6IGRlYWRsaW5lLFxyXG4gICAgICAgICdsZWNOdW0nOiBsZWNOdW0sXHJcbiAgICAgICAgJ2VkdUxldmVsJzogZWR1Y2F0aW9uTGV2ZWwsXHJcbiAgICAgICAgJ29yZ2FuaXNhdGlvbnMnOiBhcnJPcmdhbmlzYXRpb25zLFxyXG4gICAgICAgICdncm91cHMnOiBhcnJHcm91cHMsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhclxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5QcmFjdGljZTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHJvdW5kUGx1cyh4LCBuKSB7IC8veCAtINGH0LjRgdC70L4sIG4gLSDQutC+0LvQuNGH0LXRgdGC0LLQviDQt9C90LDQutC+0LJcclxuICAgIGlmIChpc05hTih4KSB8fCBpc05hTihuKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHZhciBtID0gTWF0aC5wb3coMTAsIG4pO1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoeCAqIG0pIC8gbTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0V2Vla3MoZmlyc3RfZGF0ZSwgc2Vjb25kX2RhdGUpIHtcclxuICAgIGxldCBmaXJzdF9hcnJheSA9IGZpcnN0X2RhdGUubWF0Y2goXHJcbiAgICAgICAgLyhcXGR7Mn0pXFwuKFxcZHsyfSlcXC4oXFxkezR9KSAoXFxkezJ9KTooXFxkezJ9KS8pO1xyXG4gICAgbGV0IHNlY29uZF9hcnJheSA9IHNlY29uZF9kYXRlLm1hdGNoKFxyXG4gICAgICAgIC8oXFxkezJ9KVxcLihcXGR7Mn0pXFwuKFxcZHs0fSkgKFxcZHsyfSk6KFxcZHsyfSkvKTtcclxuICAgIGxldCBmaXJzdCA9IERhdGUuVVRDKGZpcnN0X2FycmF5WzNdLCBmaXJzdF9hcnJheVsyXSAtIDEsIGZpcnN0X2FycmF5WzFdKTtcclxuICAgIGxldCBzZWNvbmQgPSBEYXRlLlVUQyhzZWNvbmRfYXJyYXlbM10sIHNlY29uZF9hcnJheVsyXSAtIDEsIHNlY29uZF9hcnJheVsxXSk7XHJcbiAgICBsZXQgd2Vla3MgPSAoTWF0aC5jZWlsKChzZWNvbmQgLSBmaXJzdCkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpKSAvIDc7XHJcbiAgICByZXR1cm4gd2Vla3M7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSW50ZWdlcihudW0pIHtcclxuICAgIHJldHVybiAobnVtIF4gMCkgPT09IG51bTtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuY3JlYXRlV2Vla3NUZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHRvRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlSW5wdXRcIik7XHJcbiAgICBsZXQgZnJvbURhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIik7XHJcbiAgICBsZXQgdG9EYXRlQ2FsZW5kYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUNhbGVuZGFyXCIpO1xyXG4gICAgdG9EYXRlQ2FsZW5kYXIuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXh0V2Vla3NcIik7XHJcbiAgICB0ZXh0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICBmcm9tRGF0ZS5vbmNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0b0RhdGVDYWxlbmRhci5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcclxuICAgICAgICB0b0RhdGUudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgIH07XHJcbiAgICB0b0RhdGUub25jaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHdlZWtzID0gZ2V0V2Vla3MoZnJvbURhdGUudmFsdWUucmVwbGFjZSgvXFxzKy9nLCAnJylcclxuICAgICAgICAgICAgKyBcIiAwMDowMFwiLCB0b0RhdGUudmFsdWUucmVwbGFjZSgvXFxzKy9nLCAnJykgKyBcIiAwMDowMFwiKTtcclxuICAgICAgICB0ZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgd2Vla3MgPSByb3VuZFBsdXMod2Vla3MsIDEpO1xyXG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gXCLQmtC+0LvQuNGH0LXRgdGC0LLQviDQvdC10LTQtdC70Yw6IFwiICsgd2Vla3M7XHJcbiAgICAgICAgaWYgKGlzSW50ZWdlcih3ZWVrcykpIHtcclxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1hcmdpbjIwIGdyZWVuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1hcmdpbjIwIHJlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgICBpZiAoZWR1Y2F0aW9uTGV2ZWwgPT09IFwiYmFjaGVsb3JcIikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufTtcclxuVmlldy5wcm90b3R5cGUuY2xlYXJQcmFjdGljZVNlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmNyZWF0ZVdlZWtzVGV4dCgpO1xyXG5cclxuICAgIGxldCB0b0RhdGVDYWxlbmRhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlQ2FsZW5kYXJcIik7XHJcbiAgICB0b0RhdGVDYWxlbmRhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICB0b0RhdGVDYWxlbmRhci52YWx1ZSA9IFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lXCIpLnZhbHVlID0gXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjTnVtXCIpLnZhbHVlID0gXCJcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBpbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAnaW5wdXQnKTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGlucHV0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAkKGlucHV0c1tqXSkuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiBsZXQgc3RlcHM9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdGVwc1wiKVswXS5jaGlsZHJlbjtcclxuICAgICBzdGVwc1swXS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcclxuICAgICBmb3IobGV0IGk9MDtpPHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgIHN0ZXBzW2ldLnN0eWxlLmRpc3BsYXk9J25vbmUnO1xyXG4gICAgIH0qL1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUucmVuZGVySW5mbyA9IGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGxldCBzdGFydF95ZWFyID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoMCwgNCksXHJcbiAgICAgICAgICAgIHN0YXJ0X21vbnRoID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgICAgIHN0YXJ0X2RheSA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpLFxyXG4gICAgICAgICAgICBlbmRfeWVhciA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cigwLCA0KSxcclxuICAgICAgICAgICAgZW5kX21vbnRoID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgICAgICBlbmRfZGF5ID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpO1xyXG4gICAgICAgIGxldCBzdGFydF9kYXRlID0gc3RhcnRfZGF5ICsgJy0nICsgc3RhcnRfbW9udGggKyAnLScgKyBzdGFydF95ZWFyO1xyXG4gICAgICAgIGxldCBlbmRfZGF0ZSA9IGVuZF9kYXkgKyAnLScgKyBlbmRfbW9udGggKyAnLScgKyBlbmRfeWVhcjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9ICfRgSAnICsgc3RhcnRfZGF0ZSArICcg0L/QviAnICsgZW5kX2RhdGU7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9ICfQn9GA0LDQutGC0LjQutCwICc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gXCLQn9GA0LDQutGC0LjQutC4XCIgKyBcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gXCIgXCI7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkUHJhY3RpY2UgPSBmdW5jdGlvbiAoc2VjdGlvbikge1xyXG4gICAgbGV0IGlkLCBQcmFjdGljZXMgPSBbXTtcclxuICAgIGlmIChzZWN0aW9uID09PSBcImZvck9yZ2FuaXNhdGlvblNlY3Rpb25cIikge1xyXG4gICAgICAgIGlkID0gdGhpcy5pZFRyZWVWaWV3c1ByYWN0aWNlWzFdO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWQgPSB0aGlzLmlkVHJlZVZpZXdzUHJhY3RpY2VbMF07XHJcbiAgICB9XHJcbiAgICBsZXQgdHJlZVZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBsZXQgbGlOdW1iZXIgPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaU51bWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFByYWN0aWNlcyA9IGxpTnVtYmVyW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgICAgICBpZiAoc2VsZWN0ZWRQcmFjdGljZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRQcmFjdGljZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcmFjdGljZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHNlbGVjdGVkUHJhY3RpY2VzW2pdLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVpZFwiKSxcclxuICAgICAgICAgICAgICAgICAgICBcImdyb3Vwc1wiOiBzZWxlY3RlZFByYWN0aWNlc1tqXS5wYXJlbnRFbGVtZW50Lm5leHRTaWJsaW5nLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFByYWN0aWNlcy5wdXNoKHByYWN0aWNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gUHJhY3RpY2VzO1xyXG59O1xyXG5cclxuXHJcblZpZXcucHJvdG90eXBlLnJlbmRlclRhYmxlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGlmIChkYXRhID09PSAwKSB7XHJcbiAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQ2xlYXJUYWJsZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQ2xlYXJUYWJsZSgpO1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkFkZERhdGEoZGF0YSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jb2xvclRhYmxlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChkYXRhW2ldLnN0YXR1cyA9PT0gMSkge1xyXG4gICAgICAgICAgICAkKHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkdldE5vZGVzKGkpKS5hZGRDbGFzcyhcImFwcHJvdmVkX3N0dWRcIik7XHJcbiAgICAgICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkdldE5vZGVzKGkpLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRpbmdfMSBhcHByb3ZlZF9zdHVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGF0YVtpXS5zdGF0dXMgPT09IDApIHtcclxuICAgICAgICAgICAgJCh0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKSkuYWRkQ2xhc3MoXCJhcHBsaWVkX3N0dWRcIik7XHJcbiAgICAgICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkdldE5vZGVzKGkpLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRpbmdfMSBhcHBsaWVkX3N0dWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY2hhbmdlWWVhciA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICBpZiAoc2VsZWN0ZWRFbGVtKSB7XHJcbiAgICAgICAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKTtcclxuICAgIH1cclxuICAgIHNlbGVjdGVkRWxlbSA9IG5vZGU7XHJcbiAgICBzZWxlY3RlZEVsZW0uY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpO1xyXG4gICAgdGhpcy5zZWxlY3RlZFllYXIgPSBzZWxlY3RlZEVsZW0uaW5uZXJIVE1MO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUudXBkYXRlWWVhciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc05hbWUgPT09ICdpdGVtIHllYXInIHx8IHRhcmdldC5jbGFzc05hbWVcclxuICAgICAgICAgICAgPT09ICdpdGVtIHllYXIgY3VycmVudCcpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VZZWFyKHRhcmdldCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRHcm91cHMgPSBmdW5jdGlvbiAodHJlZVZpZXcpIHtcclxuICAgIGlmICh0cmVlVmlldyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IGZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXNcIilbMF0uY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xyXG4gICAgICAgICAgICAgICAgdHJlZVZpZXcgPSBmcmFtZXNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBHcm91cHMgPSBbXTtcclxuICAgIGxldCBsaU51bWJlciA9IHRyZWVWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpTnVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwcyA9IGxpTnVtYmVyW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgICAgICBpZiAoZ3JvdXBzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwID0gZ3JvdXBzW2pdLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5pbmRleE9mKFwi0LrRg9GA0YFcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR3JvdXBzLnB1c2goZ3JvdXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIEdyb3VwcztcclxufTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBuYW1lTGVhZiwgdWlkKSB7XHJcbiAgICBhd2FpdCB0cmVlLmFkZExlYWYobm9kZSwgbmFtZUxlYWYsIHtcclxuICAgICAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlLFxyXG4gICAgICAgIHVpZDogdWlkXHJcbiAgICB9KTtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUucmVtb3ZlQ2hpbGRyZW4gPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZE5vZGVzO1xyXG4gICAgd2hpbGUgKGNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGRyZW5bMF0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY2xlYXJHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBpZCA9IDA7XHJcbiAgICB3aGlsZSAoaWQgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciBsaUFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgIHRoaXMuaWRUcmVlVmlld3NbaWRdKS5jaGlsZHJlblswXS5jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbihsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWQrKztcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuY2xlYXJQcmFjdGljZVRyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yIChsZXQgbiA9IDA7IG4gPCB0aGlzLmlkVHJlZVZpZXdzUHJhY3RpY2UubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLmlkVHJlZVZpZXdzUHJhY3RpY2Vbbl07XHJcbiAgICAgICAgbGV0IGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbihsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0uY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbihjaGlsZHJlbltqXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZUdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGNvdXJzZXMsIGdyb3Vwcykge1xyXG4gICAgbGV0IGlkQ291bnRlciA9IDAsIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhciwgY250O1xyXG4gICAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB3aGlsZSAoaWRDb3VudGVyIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyB0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl0pLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgICAgICAgIGkgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbnQgPSAwO1xyXG4gICAgICAgIGZvciAoaTsgaSA8IGNvdXJzZU51bWJlcjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpLicgKyBjb3Vyc2VzTmFtZVtjbnRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdXHJcbiAgICAgICAgICAgICAgICAgICAgPT09IFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtZGlhbG9nQWRkLWJhY2hlbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICB8fCB0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl1cclxuICAgICAgICAgICAgICAgICAgICA9PT0gXCJncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF0uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbSA9IG5vZGUuZmluZCgndWwnKVswXS5jaGlsZHJlbltub2RlLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd1bCcpWzBdLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWxlbSkuYWRkQ2xhc3MoXCJjb2xsYXBzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGdyb3Vwcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291cnNlc1tpXS5ncm91cHNbal0gPT09IGdyb3Vwc1trXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50cyA9IGdyb3Vwc1trXS5zdHVkZW50cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgc3R1ZGVudHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsICQoZWxlbSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50c1trXS5uYW1lLCBzdHVkZW50c1trXS51aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRzID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS11aWRdJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBpbnB1dHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2tdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF0uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWRDb3VudGVyKys7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLm15VXBkYXRlVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoY291cnNlcywgaWQpIHtcclxuICAgIGxldCBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXIsIG47XHJcbiAgICBsZXQgY291cnNlc05hbWUgPSBbJ2ZpcnN0JywgJ3NlY29uZCcsICd0aGlyZCcsICdmb3VydGgnXTtcclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyBpZCkuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgaWYgKGlkLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgY291cnNlTnVtYmVyID0gbWFzdGVyWWVhcjtcclxuICAgICAgICBpID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICAgIGkgPSAwO1xyXG4gICAgfVxyXG4gICAgbiA9IDA7XHJcbiAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW25dKTtcclxuICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbisrO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgZWR1TGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVMZXZlbFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveCh0cmVlLCBub2RlLCBuYW1lTGVhZiwgaWRUeXBlT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB0cmVlLmFkZExlYWYobm9kZSwgbmFtZUxlYWYsIHtcclxuICAgICAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIG5vZGUuZmluZCgndWwnKS5maW5kKCdsaScpLmxhc3QoKVswXS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCAndHlwZV9vcmdfJ1xyXG4gICAgICAgICsgaWRUeXBlT3JnYW5pc2F0aW9uKTtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICAgIHZhciB0cmVlVmlld09yZ2FuaXNhdGlvbnMgPSAkKFxyXG4gICAgICAgIFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBub2RlID0gdHJlZVZpZXdPcmdhbmlzYXRpb25zLmVsZW1lbnQuZmluZCgnbGkubm9kZScpO1xyXG4gICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZVZpZXdPcmdhbmlzYXRpb25zLCBub2RlLFxyXG4gICAgICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnNldFByYWN0aWNlc0luVHJlZVZpZXcgPSBmdW5jdGlvbiAocHJhY3RpY2VzLCB0eXBlc1ByYWN0aWNlcykge1xyXG4gICAgZm9yIChsZXQgbiA9IDA7IG4gPCB0aGlzLmlkVHJlZVZpZXdzUHJhY3RpY2UubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLmlkVHJlZVZpZXdzUHJhY3RpY2Vbbl07XHJcbiAgICAgICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgaWQpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByYWN0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHR5cGVzUHJhY3RpY2VzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJhY3RpY2VzW2ldLmlkX3R5cGVfcHJhY3RpY2UgPT09IHR5cGVzUHJhY3RpY2VzW2pdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpQXJyID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaUFyci5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlBcnJba10uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09ICgndHlwZV9wcmFjdF8nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB0eXBlc1ByYWN0aWNlc1tqXS5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSAkKGxpQXJyW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmFjdGljZXNbaV0uZ3JvdXBzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmFjdGljZXNbaV0uZ3JvdXBzLCBwcmFjdGljZXNbaV0uaWRfcHJhY3RpY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmNsZWFyVHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICdvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRPcmdhbmlzYXRpb25zSW5UcmVlVmlldyA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbikge1xyXG4gICAgdmFyIHRyZWUgPSAkKFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAob3JnYW5pc2F0aW9uc1tpXS5pZF90eXBlX29yZ2FuaXNhdGlvbiA9PT0gdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsaUFyciA9IHRyZWUuZWxlbWVudC5maW5kKCdsaScpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxpQXJyLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpQXJyW2tdLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSAoJ3R5cGVfb3JnXydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSAkKGxpQXJyW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEluZm9OZXdPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZUNvbXBhbnlcIik7XHJcbiAgICB2YXIgdHlwZU9yZyA9IGUub3B0aW9uc1tlLnNlbGVjdGVkSW5kZXhdLnRleHQ7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0ge1xyXG4gICAgICAgICduYW1lJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAndHlwZU9yZyc6IHR5cGVPcmcsXHJcbiAgICAgICAgJ2luZm9PcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdlbWFpbE9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikudmFsdWUsXHJcbiAgICAgICAgJ3Bob25lT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSxcclxuICAgICAgICAncGxhY2VzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdsb2dpbk9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdwc3dkT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAnYWRkcmVzc09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkcmVzc09yZ1wiKS52YWx1ZSxcclxuICAgICAgICAnaWQnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkQ29tcGFueVwiKS5pbm5lckhUTUxcclxuICAgIH07XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb25TZWxlY3QgPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICAgIGxldCB0eXBlT3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4odHlwZU9yZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IHR5cGVzT3JnYW5pc2F0aW9uW2ldLm5hbWU7XHJcbiAgICAgICAgdHlwZU9yZy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0T3JnYW5pc2F0aW9uc0xpc3QgPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9ucywgaWRMaXN0KSB7XHJcbiAgICBsZXQgbGlzdE9yZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkTGlzdCk7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpc3RPcmcpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0XCIpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X2xpc3RfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xyXG4gICAgICAgIGlmIChpZExpc3QgPT09IFwib3JnYW5pc2F0aW9uTGlzdFwiKSB7XHJcbiAgICAgICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC10aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiaWRfb3JnYW5pc2F0aW9uXCIsIG9yZ2FuaXNhdGlvbnNbaV0uaWQpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBvcmdhbmlzYXRpb25zW2ldLm5hbWU7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfdGl0bGUpO1xyXG4gICAgICAgIGlmIChpZExpc3QgPT09IFwib3JnYW5pc2F0aW9uTGlzdFwiKSB7XHJcbiAgICAgICAgICAgIGxldCBzcGFuX2xpc3Rfc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3Qtc3VidGl0bGVcIik7XHJcbiAgICAgICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5pbm5lckhUTUwgPSAn0JLRgdC10LPQviDQvNC10YHRgjogJ1xyXG4gICAgICAgICAgICAgICAgKyBvcmdhbmlzYXRpb25zW2ldLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICAgICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3N1YnRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGFuX2xpc3RfcmVtYXJrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1yZW1hcmtcIik7XHJcbiAgICAgICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuaW5uZXJIVE1MID0gJ9Ce0YHRgtCw0LvQvtGB0Yw6ICdcclxuICAgICAgICAgICAgICAgICsgb3JnYW5pc2F0aW9uc1tpXS5udW1fdmFjYW50X3BsYWNlcztcclxuICAgICAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfcmVtYXJrKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X2xpc3RfY29udGVudCk7XHJcblxyXG4gICAgICAgIGxldCBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICBcImlubGluZS1ibG9jayBsaXN0LWNvbnRlbnQgc2V0dGluZ3NPcmdhbmlzYXRpb25cIik7XHJcbiAgICAgICAgaWYgKGlkTGlzdCA9PT0gXCJvcmdhbmlzYXRpb25MaXN0XCIpIHtcclxuICAgICAgICAgICAgbGV0IHNwYW5fdXNlcl9wbHVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuX3VzZXJfcGx1cy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJtaWYtdXNlci1wbHVzIG1pZi1sZyBmZy1ncmF5IGFkZC1zdHVkZW50LW9yZ2FuaXNhdGlvblwiKTtcclxuICAgICAgICAgICAgc3Bhbl91c2VyX3BsdXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nKTtcclxuICAgICAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3VzZXJfcGx1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3Bhbl9wZW5jaWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9wZW5jaWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgXCJtaWYtcGVuY2lsIG1pZi1sZyBmZy1ncmF5IGVkaXQtb3JnYW5pc2F0aW9uXCIpO1xyXG4gICAgICAgIHNwYW5fcGVuY2lsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fcGVuY2lsKTtcclxuXHJcbiAgICAgICAgLyogbGV0IHNwYW5fY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICBzcGFuX2NhbmNlbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1pZi1jYW5jZWwgbWlmLWxnIGZnLXllbGxvd1wiKTtcclxuICAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX2NhbmNlbCk7Ki9cclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbik7XHJcblxyXG4gICAgICAgIGxpc3RPcmcuYXBwZW5kQ2hpbGQoZGl2X2xpc3QpO1xyXG4gICAgfVxyXG5cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0SWRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBpZE9yZ2FuaXNhdGlvbiA9IDA7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmlkID09PSBcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKSB7XHJcbiAgICAgICAgaWRPcmdhbmlzYXRpb24gPSArZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMl0uaW5uZXJIVE1MO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWRPcmdhbmlzYXRpb24gPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmdldEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgXCJpZF9vcmdhbmlzYXRpb25cIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWRPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXROYW1lT3JnYW5pc2F0aW9uSW5UcmVldmlldyA9IGZ1bmN0aW9uIChpZFRyZWV2aWV3KSB7XHJcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRUcmVldmlldyk7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICAgIFwiYWN0aXZlXCIpWzBdLnF1ZXJ5U2VsZWN0b3IoJ1tpZF9vcmdhbmlzYXRpb24nKS5pbm5lckhUTUw7XHJcbiAgICByZXR1cm4gbmFtZU9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnNob3dEaWFsb2dPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLm5hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkQ29tcGFueVwiKS5pbm5lckhUTUwgPSBvcmdhbmlzYXRpb24uaWQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmluZm9fb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5waG9uZV9vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtYWlsT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmVtYWlsX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwiYWRkcmVzc09yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5hZGRyZXNzX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwicGxhY2VzQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJsb2dpbkNvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24ubG9naW5fb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5wc3dkX29yZ2FuaXNhdGlvbjtcclxuICAgIG1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dDcmVhdGVDb21wYW55Jyk7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmRpYWxvZ09wZW4gPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIG1ldHJvRGlhbG9nLm9wZW4oaWQpO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uVGl0bGUgPSBmdW5jdGlvbiAobmFtZU9yZ2FuaXNhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCwgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQpIHtcclxuICAgIGlmIChub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9PT0gMCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm9uQXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwiLCDQv9GD0YHRglwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub25BcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnTmFtZVwiKS5pbm5lckhUTUwgPSBuYW1lT3JnYW5pc2F0aW9uO1xyXG5cclxuICAgIGlmIChhcHByb3ZlZF9zdHVkZW50X2NvdW50ID09PSAwKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgIFwiYXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INGD0YLQstC10YDQttC00LXQvdC90YvRhSDRgdGC0YPQtNC10L3RgtC+0LIg0L/Rg9GB0YIuXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgXCJhcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCLQodC/0LjRgdC+0Log0YPRgtCy0LXRgNC20LTQtdC90L3Ri9GFINGB0YLRg9C00LXQvdGC0L7Qsi5cIjtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lID09PSBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIikge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgIH1cclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uQ2xpY2sgPSBlbGVtZW50LmNoaWxkcmVuWzBdLmlubmVySFRNTDtcclxuICAgIHJldHVybiBuYW1lT3JnYW5pc2F0aW9uQ2xpY2s7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXROYW1lT3JnYW5pc2F0aW9uQnlUaXRsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ05hbWVcIikuaW5uZXJIVE1MO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0T25DbGlja05hbWVPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHJldHVybiBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmlubmVySFRNTDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVN0dWRlbnRzTGlzdFZpZXcgPSBmdW5jdGlvbiAoc3R1ZGVudHMsIGlkTGlzdCkge1xyXG4gICAgbGV0IGxpc3RTdHVkZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkTGlzdCk7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpc3RTdHVkZW50cyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0XCIpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X2xpc3RfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtdGl0bGVcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcInJlcXVlc3RcIiwgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcInVpZFwiLCBzdHVkZW50c1tpXS51aWRfc3R1ZGVudCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcIm9yZ1wiLCBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24pO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5kaXNwbGF5TmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF90aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3Rfc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1zdWJ0aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuaW5uZXJIVE1MID0gc3R1ZGVudHNbaV0uZ3JvdXBfbmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9zdWJ0aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCB5ZWFyID0gc3R1ZGVudHNbaV0uZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0LnN1YnN0cigwLCA0KSxcclxuICAgICAgICAgICAgbW9udGggPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgICAgICBkYXkgPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDgsIDIpO1xyXG4gICAgICAgIGxldCBkYXRlID0gZGF5ICsgJy0nICsgbW9udGggKyAnLScgKyB5ZWFyO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3JlbWFyayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1yZW1hcmtcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0JTQsNGC0LAg0LfQsNC/0LjRgdC4OiAnICsgZGF0ZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9yZW1hcmspO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfbGlzdF9jb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgIFwiaW5saW5lLWJsb2NrIGxpc3QtY29udGVudCBzZXR0aW5nc09yZ2FuaXNhdGlvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKGlkTGlzdCAhPT0gXCJhcHByb3ZlZFN0dWRlbnRzXCIpIHtcclxuICAgICAgICAgICAgbGV0IHNwYW5fc3R1ZGVudF9hcHByb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuX3N0dWRlbnRfYXBwcm92ZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJtaWYtY2hlY2ttYXJrIG1pZi1sZyBmZy1ncmVlblwiKTtcclxuICAgICAgICAgICAgc3Bhbl9zdHVkZW50X2FwcHJvdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tBcHByb3ZlU3R1ZGVudCk7XHJcbiAgICAgICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9zdHVkZW50X2FwcHJvdmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwYW5fc3R1ZGVudF9yZWplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9zdHVkZW50X3JlamVjdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1pZi1jYW5jZWwgbWlmLWxnIGZnLXJlZFwiKTtcclxuICAgICAgICBzcGFuX3N0dWRlbnRfcmVqZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tSZWplY3RTdHVkZW50KTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fc3R1ZGVudF9yZWplY3QpO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uKTtcclxuXHJcbiAgICAgICAgbGlzdFN0dWRlbnRzLmFwcGVuZENoaWxkKGRpdl9saXN0KTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RCbG9ja1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzUmVxdWVzdHNcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnJlbmRlck9yZ2FuaXNhdGlvblNlY3Rpb24gPSBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25MaXN0Q3VycmVudFByYWN0aWNlVGV4dFwiKTtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICB0ZXh0LmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INC+0YDQs9Cw0L3QuNC30LDRhtC40Lkg0LIg0L/RgNCw0LrRgtC40LrQtVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBcItCf0YDQsNC60YLQuNC60Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIjtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLk9wZW5PckNsb3NlTG9hZGVyID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICBpZCA9IFwibG9hZFwiO1xyXG4gICAgbGV0IGRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc3R5bGUuZGlzcGxheTtcclxuICAgIGlmIChkaXNwbGF5ID09PSBcImJsb2NrXCIpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZFN0dWRlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBub2RlID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICdbcmVxdWVzdF0nKTtcclxuICAgIGxldCBzdHVkZW50ID0ge1xyXG4gICAgICAgICdpZF9yZXF1ZXN0Jzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJyZXF1ZXN0XCIpLFxyXG4gICAgICAgICd1aWRfc3R1ZGVudCc6IG5vZGUuZ2V0QXR0cmlidXRlKFwidWlkXCIpLFxyXG4gICAgICAgICdpZF9vcmdhbmlzYXRpb24nOiBub2RlLmdldEF0dHJpYnV0ZShcIm9yZ1wiKVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzXCIpLmluZGV4T2YoXCJtaWYtY2FuY2VsXCIpID09PSAwKSB7XHJcbiAgICAgICAgc3R1ZGVudFsnaWRfc3RhdHVzJ10gPSAyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3R1ZGVudFsnaWRfc3RhdHVzJ10gPSAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0dWRlbnQ7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnNldFllYXJzQXJyYXkgPSBmdW5jdGlvbiAoeWVhcnMpIHtcclxuICAgIGxldCBidXR0b25BcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpO1xyXG4gICAgbGV0IGJ1dHRvbkFycmF5MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5MVwiKTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oYnV0dG9uQXJyYXkpO1xyXG4gICAgdGhpcy5yZW1vdmVDaGlsZHJlbihidXR0b25BcnJheTEpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB5ZWFycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpdGVtIHllYXJcIik7XHJcbiAgICAgICAgc3Bhbi5pbm5lckhUTUwgPSB5ZWFyc1tpXTtcclxuICAgICAgICBidXR0b25BcnJheS5hcHBlbmRDaGlsZChzcGFuKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW4xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW4xLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xyXG4gICAgICAgIHNwYW4xLmlubmVySFRNTCA9IHllYXJzW2ldO1xyXG4gICAgICAgIGJ1dHRvbkFycmF5LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgICAgIGJ1dHRvbkFycmF5MS5hcHBlbmRDaGlsZChzcGFuMSk7XHJcbiAgICB9XHJcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpdGVtIHllYXJcIik7XHJcbiAgICBzcGFuLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiY3JlYXRlUHJhY3RpY2VCdG5cIik7XHJcbiAgICBzcGFuLmlubmVySFRNTCA9IFwiK1wiO1xyXG4gICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVByYWN0aWNlQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSk7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZFN0dWRlbnRzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgU3R1ZGVudHMgPSBbXTtcclxuICAgIGxldCBub2RlcyA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0U2libGluZy5pbm5lckhUTUwuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMVxyXG4gICAgICAgICAgICAmJiBpc05hTigrbm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MLnN1YnN0cigwLFxyXG4gICAgICAgICAgICAgICAgMikpKSB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICBsZXQgdWlkID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdWlkXCIpO1xyXG4gICAgICAgICAgICBTdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICB1aWQ6IHVpZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU3R1ZGVudHM7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dFbmFibGVDaGVja2JveGVzID0gZnVuY3Rpb24gKG5hbWVzR3JvdXBzLCBpZEVsZW1lbnQpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEVsZW1lbnQpO1xyXG4gICAgbGV0IGlucHV0cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuYW1lc0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBsZXQgY291cnNlID0gaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGNvdXJzZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUtY291cnNlJyk7XHJcbiAgICAgICAgICAgIGxldCBzdHVkZW50c0NoZWNrYm94ZXMgPSBpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgICAgICAgICAnW2RhdGEtdWlkXScpO1xyXG4gICAgICAgICAgICBpZiAoc3R1ZGVudHNDaGVja2JveGVzLmxlbmd0aCAhPT0gMClcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzQ2hlY2tib3hlc1swXS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHN0dWRlbnRzQ2hlY2tib3hlcy5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHNDaGVja2JveGVzW25dLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jykuc2V0QXR0cmlidXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuYW1lc0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQubmV4dFNpYmxpbmcuaW5uZXJIVE1MID09PSBuYW1lc0dyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvdXJzZSA9IGlucHV0c1tpXS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvdXJzZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIikgPT09IFwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgICYmIGNvdXJzZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKS5pbmRleE9mKFwiYWN0aXZlLWNvdXJzZVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGNvdXJzZSkuYWRkQ2xhc3MoXCJhY3RpdmUtY291cnNlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5wdXRzW2ldLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRzQ2hlY2tib3hlcyA9IGlucHV0c1tpXS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAgICAgICAnW2RhdGEtdWlkXScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgc3R1ZGVudHNDaGVja2JveGVzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHNDaGVja2JveGVzW25dLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykucmVtb3ZlQXR0cmlidXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0RWxlbUJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgcmV0dXJuIGVsZW07XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVJbnB1dHNPcmRlciA9IGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JkZXItYmxvY2tcIik7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKHBhcmVudCk7XHJcbiAgICBsZXQgaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XHJcbiAgICBoNC5pbm5lckhUTUwgPSBcItCg0YPQutC+0LLQvtC00LjRgtC10LvQuFwiO1xyXG4gICAgaDQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhbGlnbi1jZW50ZXJcIik7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaDQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZpZWxkIG1hcmdpbjIwXCIpO1xyXG5cclxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IHNlbGVjdGVkR3JvdXBzW2ldO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcclxuXHJcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImdyb3VwTmFtZVwiLCBzZWxlY3RlZEdyb3Vwc1tpXSk7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVJbnB1dHNSZXBvcnQgPSBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyb3Vwcy1yZXBvcnQtYmxvY2tcIik7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKHBhcmVudCk7XHJcbiAgICBsZXQgaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XHJcbiAgICBoNC5pbm5lckhUTUwgPSBcItCY0L3RhNC+0YDQvNCw0YbQuNGPINC/0L4g0LrQsNC20LTQvtC5INCz0YDRg9C/0L/QtVwiO1xyXG4gICAgaDQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhbGlnbi1jZW50ZXJcIik7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaDQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBkaXZfZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdl9ncm91cC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImdyb3VwIFwiICsgc2VsZWN0ZWRHcm91cHNbaV0pO1xyXG5cclxuICAgICAgICBsZXQgaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XHJcbiAgICAgICAgaDQuaW5uZXJIVE1MID0gc2VsZWN0ZWRHcm91cHNbaV07XHJcbiAgICAgICAgaDQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhbGlnbi1jZW50ZXJcIik7XHJcbiAgICAgICAgZGl2X2dyb3VwLmFwcGVuZENoaWxkKGg0KTtcclxuXHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZmllbGQgbWFyZ2luMjBcIik7XHJcbiAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICBwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaW5saW5lLWJsb2NrIHN1Yi1oZWFkZXJcIik7XHJcbiAgICAgICAgcC5pbm5lckhUTUwgPSBcItCg0YPQutC+0LLQvtC00LjRgtC10LvRjFwiO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzdXBlcnZpc29yXCIpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgZGl2X2dyb3VwLmFwcGVuZENoaWxkKGRpdik7XHJcblxyXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZmllbGQgbWFyZ2luMjBcIik7XHJcbiAgICAgICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IFwi0KHRgtGD0LQuICg0INC4IDUpXCI7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZ29vZF9zdHVkZW50c1wiKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwibnVtYmVyXCIpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgZGl2X2dyb3VwLmFwcGVuZENoaWxkKGRpdik7XHJcblxyXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZmllbGQgbWFyZ2luMjBcIik7XHJcbiAgICAgICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IFwi0JrQvtC7LdCy0L4g0L/RgNC10L/QvtC0Li3RgNGD0LrQvtCy0L7QtC5cIjtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0ZWFjaGVyX251bWJlclwiKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwibnVtYmVyXCIpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgZGl2X2dyb3VwLmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRpdl9ncm91cCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgIGxldCB5ZWFyID0gZGF0ZS5zdWJzdHIoMCwgNCksXHJcbiAgICAgICAgbW9udGggPSBkYXRlLnN1YnN0cig1LCAyKSxcclxuICAgICAgICBkYXkgPSBkYXRlLnN1YnN0cig4LCAyKTtcclxuICAgIHJldHVybiAoZGF5ICsgJy4nICsgbW9udGggKyAnLicgKyB5ZWFyKTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRPcmRlciA9IGZ1bmN0aW9uIChwcmFjdGljZSwgc2VsZWN0ZWRHcm91cHMsIGFsbEdyb3VwcywgZGF0YSwgb3JnYW5pc2F0aW9ucykge1xyXG4gICAgbGV0IGdyb3Vwc0ZvckRvY3VtZW50ID0gW107XHJcbiAgICBsZXQgZWR1Y2F0aW9uYWxfbGV2ZWwgPSBwcmFjdGljZS5lZHVfbGV2ZWw7XHJcbiAgICBsZXQgYmxvY2tUZWFjaGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwib3JkZXItYmxvY2tcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpO1xyXG4gICAgbGV0IHRlYWNoZXJzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrVGVhY2hlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZ3JvdXBOYW1lID0gYmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgbGV0IHRlYWNoZXIgPSBibG9ja1RlYWNoZXJzW2ldLmNoaWxkcmVuWzFdLnZhbHVlO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2pdID09PSBncm91cE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRlYWNoZXJzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlYWNoZXJcIjogdGVhY2hlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJncm91cE5hbWVcIjogZ3JvdXBOYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0uaW5kZXhPZih0aGlzLmluZm9Hcm91cHNbal0ubmFtZSkgIT09IC0xXHJcbiAgICAgICAgICAgICAgICAmJiB0aGlzLmluZm9Hcm91cHNbal0udHlwZSA9PT0gZWR1Y2F0aW9uYWxfbGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgYWxsR3JvdXBzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldID09PSBhbGxHcm91cHNbbl0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRlYWNoZXJzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IHRlYWNoZXJzW2tdLmdyb3VwTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS50ZWFjaGVyID0gdGVhY2hlcnNba10udGVhY2hlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0udHlwZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5mdWxsTmFtZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS5mdWxsTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0ucHJvZmlsZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS5wcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3Vwc0ZvckRvY3VtZW50LnB1c2goYWxsR3JvdXBzW25dKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBkZWFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFuXCIpLnZhbHVlO1xyXG4gICAgbGV0IGhlYWRfb2ZfZGVwYXJ0bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZF9vZl9kZXBhcnRtZW50XCIpLnZhbHVlO1xyXG4gICAgbGV0IHR5cGVfZG9jdW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcImdkdHlwZURvY3VtZW50XCIpLm9wdGlvbnNbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJnZHR5cGVEb2N1bWVudFwiKS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcclxuICAgIGxldCBkb2N1bWVudHMgPSBbXTtcclxuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBwcmFjdGljZS5UeXBlX3ByYWN0aWNlLm5hbWU7XHJcbiAgICBpZiAocHJhY3RpY2UuaWRfdHlwZV9wcmFjdGljZSA9PT0gMiB8fCBwcmFjdGljZS5pZF90eXBlX3ByYWN0aWNlID09PSAzIHx8IHByYWN0aWNlLmlkX3R5cGVfcHJhY3RpY2UgPT09IDQpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2UgPSBcItC/0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UudG9Mb3dlckNhc2UoKTtcclxuICAgIHR5cGVQcmFjdGljZSA9IHR5cGVQcmFjdGljZS5yZXBsYWNlQXQodHlwZVByYWN0aWNlLmxlbmd0aCAtIDEsIFwi0LlcIik7XHJcbiAgICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UucmVwbGFjZUF0KHR5cGVQcmFjdGljZS5sZW5ndGggLSAyLCBcItC+XCIpO1xyXG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgbGV0IHN0YXJ0X2RhdGUgPSB0aGlzLmZvcm1hdERhdGUocHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZSk7XHJcbiAgICBsZXQgZW5kX2RhdGUgPSB0aGlzLmZvcm1hdERhdGUocHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2UpO1xyXG4gICAgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCLRg9GH0LXQsdC90L7QuVwiKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHNGb3JEb2N1bWVudC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgc3R1ZGVudHMgPSBncm91cHNGb3JEb2N1bWVudFtpXS5zdHVkZW50cztcclxuICAgICAgICAgICAgbGV0IHN0ciA9IEpTT04uc3RyaW5naWZ5KHN0dWRlbnRzLCBbXCJuYW1lXCJdKTtcclxuICAgICAgICAgICAgc3R1ZGVudHMgPSBKU09OLnBhcnNlKHN0cik7XHJcbiAgICAgICAgICAgIGxldCBkb2N1bWVudCA9IHtcclxuICAgICAgICAgICAgICAgIFwiZGlyZWN0aW9uXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmZ1bGxOYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJwcm9maWxlXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnByb2ZpbGUsXHJcbiAgICAgICAgICAgICAgICBcImRlYW5cIjogZGVhbixcclxuICAgICAgICAgICAgICAgIFwiaGVhZF9vZl9kZXBhcnRtZW50XCI6IGhlYWRfb2ZfZGVwYXJ0bWVudCxcclxuICAgICAgICAgICAgICAgIFwidHlwZV9wcmFjdGljZVwiOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogc3RhcnRfZGF0ZSxcclxuICAgICAgICAgICAgICAgIFwiZW5kX2RhdGVcIjogZW5kX2RhdGUsXHJcbiAgICAgICAgICAgICAgICBcImdyb3VwX25hbWVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ubmFtZSxcclxuICAgICAgICAgICAgICAgIFwic3VwZXJ2aXNvclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS50ZWFjaGVyLFxyXG4gICAgICAgICAgICAgICAgXCJzdHVkZW50c1wiOiBzdHVkZW50c1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkb2N1bWVudHMucHVzaChkb2N1bWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcItC/0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QvtC5XCIpIHtcclxuICAgICAgICBpZiAocHJhY3RpY2UuaWRfdHlwZV9wcmFjdGljZSA9PT0gMikge1xyXG4gICAgICAgICAgICBhbGVydChcclxuICAgICAgICAgICAgICAgIFwi0JLQvtC30LzQvtC20L3QvtGB0YLRjCDQs9C10L3QtdGA0LDRhtC40Lgg0LTQvtC60YPQvNC10L3RgtC+0LIg0LTQu9GPINC/0YDQtdC00LTQuNC/0LvQvtC80L3QvtC5INC/0YDQsNC60YLQuNC60Lgg0LIg0YHRgtCw0LTQuNC4INGA0LDQt9GA0LDQsdC+0YLQutC4LiDQn9GA0LjQvdC+0YHQuNC8INGB0LLQvtC4INC40LfQstC40L3QtdC90LjRjyDQt9CwINC/0YDQtdC00L7RgdGC0LDQstC70LXQvdC90YvQtSDQvdC10YPQtNC+0LHRgdGC0LLQsC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHByYWN0aWNlLmlkX3R5cGVfcHJhY3RpY2UgPT09IDMpIHtcclxuICAgICAgICAgICAgYWxlcnQoXHJcbiAgICAgICAgICAgICAgICBcItCS0L7Qt9C80L7QttC90L7RgdGC0Ywg0LPQtdC90LXRgNCw0YbQuNC4INC00L7QutGD0LzQtdC90YLQvtCyINC00LvRjyDQvdCw0YPRh9C90L4t0LjRgdGB0LvQtdC00L7QstCw0YLQtdC70YzRgdC60L7QuSDRgNCw0LHQvtGC0Ysg0LIg0YHRgtCw0LTQuNC4INGA0LDQt9GA0LDQsdC+0YLQutC4LiDQn9GA0LjQvdC+0YHQuNC8INGB0LLQvtC4INC40LfQstC40L3QtdC90LjRjyDQt9CwINC/0YDQtdC00L7RgdGC0LDQstC70LXQvdC90YvQtSDQvdC10YPQtNC+0LHRgdGC0LLQsC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbaV0uc3R1ZGVudHMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzRm9yRG9jdW1lbnQubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXS5ncm91cCA9PT0gZ3JvdXBzRm9yRG9jdW1lbnRbal0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGdyb3Vwc0ZvckRvY3VtZW50W2pdLnN0dWRlbnRzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXS5zdHVkZW50ID09PSBncm91cHNGb3JEb2N1bWVudFtqXS5zdHVkZW50c1trXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW2ldLm9yZ2FuaXNhdGlvbiA9PT0gb3JnYW5pc2F0aW9uc1tuXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW25dLmdyb3VwID0gZ3JvdXBzRm9yRG9jdW1lbnRbal0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbbl0ub3JnYW5pemF0aW9uX25hbWUgPSBvcmdhbmlzYXRpb25zW25dLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW25dLnRlYWNoZXIgPSBncm91cHNGb3JEb2N1bWVudFtqXS50ZWFjaGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0dWRlbnQgPSBkYXRhW2ldLnN0dWRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW25dLnN0dWRlbnRzLnB1c2goe1wibmFtZVwiOiBzdHVkZW50fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcmdhbmlzYXRpb25zW2pdLmdyb3VwID09PSBncm91cHNGb3JEb2N1bWVudFtpXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbnNbal0uc3R1ZGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50cyA9IEpTT04ucGFyc2Uoc3R1ZGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gSlNPTi5zdHJpbmdpZnkob3JnYW5pc2F0aW9uc1tqXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIm9yZ2FuaXphdGlvbl9uYW1lXCIsIFwidGVhY2hlclwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbal0gPSBKU09OLnBhcnNlKHN0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbal0uc3R1ZGVudHMgPSBzdHVkZW50cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnQucHVzaChvcmdhbmlzYXRpb25zW2pdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGRvY3VtZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlyZWN0aW9uXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmZ1bGxOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHJvZmlsZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5wcm9maWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVhblwiOiBkZWFuLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY291cnNlXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaGVhZF9vZl9kZXBhcnRtZW50XCI6IGhlYWRfb2ZfZGVwYXJ0bWVudCxcclxuICAgICAgICAgICAgICAgICAgICBcInR5cGVfcHJhY3RpY2VcIjogdHlwZVByYWN0aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kX2RhdGVcIjogZW5kX2RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJncm91cF9uYW1lXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvcmdhbml6YXRpb25zXCI6IG9yZ2FuaXNhdGlvbnNfZm9yX2RvY3VtZW50XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRzLnB1c2goZG9jdW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRvY3VtZW50cztcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRSZXBvcnQgPSBmdW5jdGlvbiAocHJhY3RpY2UsIHNlbGVjdGVkR3JvdXBzLCBhbGxHcm91cHMpIHtcclxuICAgIGxldCBlZHVjYXRpb25hbF9sZXZlbCA9IHByYWN0aWNlLmVkdV9sZXZlbDtcclxuICAgIGxldCBncm91cHNGb3JEb2N1bWVudCA9IFtdO1xyXG4gICAgbGV0IGJsb2NrR3JvdXBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHMtcmVwb3J0LWJsb2NrXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2dyb3VwJyk7XHJcbiAgICBsZXQgYWRkaXRpb25hbF9pbmZvID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwTmFtZSA9IGJsb2NrR3JvdXBzW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoNCcpWzBdLmlubmVySFRNTDtcclxuICAgICAgICBsZXQgc3VwZXJ2aXNvciA9IGJsb2NrR3JvdXBzW2ldLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXHJcbiAgICAgICAgICAgIFwic3VwZXJ2aXNvclwiKVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgZ29vZF9zdHVkZW50c19udW1iZXIgPSBibG9ja0dyb3Vwc1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICAgICAgICBcImdvb2Rfc3R1ZGVudHNcIilbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHRlYWNoZXJfbnVtYmVyID0gYmxvY2tHcm91cHNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcclxuICAgICAgICAgICAgXCJ0ZWFjaGVyX251bWJlclwiKVswXS52YWx1ZTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tqXSA9PT0gZ3JvdXBOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsX2luZm8ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJncm91cE5hbWVcIjogZ3JvdXBOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VwZXJ2aXNvclwiOiBzdXBlcnZpc29yLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZ29vZF9zdHVkX251bVwiOiBnb29kX3N0dWRlbnRzX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBcInRlYWNoZXJfbnVtYmVyXCI6IHRlYWNoZXJfbnVtYmVyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0uaW5kZXhPZih0aGlzLmluZm9Hcm91cHNbal0ubmFtZSkgIT09IC0xXHJcbiAgICAgICAgICAgICAgICAmJiB0aGlzLmluZm9Hcm91cHNbal0udHlwZSA9PT0gZWR1Y2F0aW9uYWxfbGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgYWxsR3JvdXBzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldID09PSBhbGxHcm91cHNbbl0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGFkZGl0aW9uYWxfaW5mby5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldID09PSBhZGRpdGlvbmFsX2luZm9ba10uZ3JvdXBOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnN1cGVydmlzb3IgPSBhZGRpdGlvbmFsX2luZm9ba10uc3VwZXJ2aXNvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uZnVsbE5hbWUgPSB0aGlzLmluZm9Hcm91cHNbal0uZnVsbE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLmdvb2Rfc3R1ZF9udW0gPSBhZGRpdGlvbmFsX2luZm9ba10uZ29vZF9zdHVkX251bTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0udGVhY2hlcl9udW1iZXIgPSBhZGRpdGlvbmFsX2luZm9ba10udGVhY2hlcl9udW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBzRm9yRG9jdW1lbnQucHVzaChhbGxHcm91cHNbbl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdGFydF9kYXRlID0gdGhpcy5mb3JtYXREYXRlKHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2UpO1xyXG4gICAgbGV0IGVuZF9kYXRlID0gdGhpcy5mb3JtYXREYXRlKHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlKTtcclxuXHJcbiAgICBsZXQgaGVhZF9vZl9kZXBhcnRtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkX29mX2RlcGFydG1lbnRcIikudmFsdWU7XHJcbiAgICBsZXQgZG9jdW1lbnRzID0gW107XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gcHJhY3RpY2UuVHlwZV9wcmFjdGljZS5uYW1lO1xyXG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgbGV0IGNvdXJzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY291cnNlXCIpLnZhbHVlO1xyXG4gICAgbGV0IGJhc2VfcHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhc2VfcHJhY3RpY2VcIikudmFsdWU7XHJcbiAgICBsZXQgbnVtX2Jhc2VfcHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm51bV9iYXNlX3ByYWN0aWNlXCIpLnZhbHVlO1xyXG4gICAgbGV0IG51bV9sZWN0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2xlY3Rpb25zXCIpLnZhbHVlO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzRm9yRG9jdW1lbnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZG9jdW1lbnQgPSB7XHJcbiAgICAgICAgICAgIFwiZGlyZWN0aW9uXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmZ1bGxOYW1lLFxyXG4gICAgICAgICAgICBcImNvdXJzZVwiOiBjb3Vyc2UsXHJcbiAgICAgICAgICAgIFwidHlwZV9wcmFjdGljZVwiOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxyXG4gICAgICAgICAgICBcImVuZF9kYXRlXCI6IGVuZF9kYXRlLFxyXG4gICAgICAgICAgICBcImdyb3VwX25hbWVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ubmFtZSxcclxuICAgICAgICAgICAgXCJiYXNlX3ByYWN0aWNlXCI6IGJhc2VfcHJhY3RpY2UsXHJcbiAgICAgICAgICAgIFwieWVhclwiOiBwcmFjdGljZS55ZWFyLFxyXG4gICAgICAgICAgICBcInRlYWNoZXJfbnVtYmVyXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXJfbnVtYmVyLFxyXG4gICAgICAgICAgICBcInN0dWRlbnRfbnVtYmVyXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN0dWRlbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgXCJnb29kX3N0dWRfbnVtXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmdvb2Rfc3R1ZF9udW0sXHJcbiAgICAgICAgICAgIFwibnVtX2Jhc2VfcHJhY3RpY2VcIjogbnVtX2Jhc2VfcHJhY3RpY2UsXHJcbiAgICAgICAgICAgIFwibnVtX2xlY3Rpb25zXCI6IG51bV9sZWN0aW9ucyxcclxuICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN1cGVydmlzb3IsXHJcbiAgICAgICAgICAgIFwiaGVhZF9vZl9kZXBhcnRtZW50XCI6IGhlYWRfb2ZfZGVwYXJ0bWVudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZG9jdW1lbnRzLnB1c2goZG9jdW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkb2N1bWVudHM7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdFZhbHVlID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkub3B0aW9uc1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc2VsZWN0ZWRJbmRleF0udmFsdWU7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VEaXNwbGF5ID0gZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZUlubmVySHRtbCA9IGZ1bmN0aW9uIChpZCwgdmFsdWUpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgZWxlbS5pbm5lckhUTUwgPSB2YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmZpbGxEaWFsb2cgPSBmdW5jdGlvbiAocHJhY3RpY2UsIG9yZ2FuaXNhdGlvbnMpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXNlX3ByYWN0aWNlXCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZWxlbS52YWx1ZSArPSBvcmdhbmlzYXRpb25zW2ldLm5hbWUgKyAnLCAnO1xyXG4gICAgfVxyXG4gICAgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2Jhc2VfcHJhY3RpY2VcIik7XHJcbiAgICBlbGVtLnZhbHVlID0gb3JnYW5pc2F0aW9ucy5sZW5ndGg7XHJcblxyXG4gICAgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2xlY3Rpb25zXCIpO1xyXG4gICAgZWxlbS52YWx1ZSA9ICtwcmFjdGljZS5sZWN0aW9uc19udW1iZXI7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnJlYWRUZXh0RmlsZSA9IGZ1bmN0aW9uIChmaWxlLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHJhd0ZpbGUgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHJhd0ZpbGUub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICByYXdGaWxlLm9wZW4oXCJHRVRcIiwgZmlsZSwgdHJ1ZSk7XHJcbiAgICByYXdGaWxlLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAocmF3RmlsZS5yZWFkeVN0YXRlID09PSA0ICYmIHJhd0ZpbGUuc3RhdHVzID09IFwiMjAwXCIpIHtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IGNhbGxiYWNrKHJhd0ZpbGUucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgdGhpcy5pbmZvR3JvdXBzID0gcmVzO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKTtcclxuICAgIHJhd0ZpbGUuc2VuZChudWxsKTtcclxufTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUucmVwbGFjZUF0ID0gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3Vic3RyKDAsIGluZGV4KSArIHJlcGxhY2VtZW50ICsgdGhpcy5zdWJzdHIoaW5kZXhcclxuICAgICAgICArIHJlcGxhY2VtZW50Lmxlbmd0aCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvVmlldy5qcyIsImNvbnN0IFNFUFRFTUJFUiA9IDk7XHJcbmNvbnN0IGZpcnN0Q291cnNlID0gMDtcclxuY29uc3Qgc2Vjb25kQ291cnNlID0gMTtcclxuY29uc3QgdGhpcmRDb3Vyc2UgPSAyO1xyXG5jb25zdCBmb3VydGhDb3Vyc2UgPSAzO1xyXG5jb25zdCBtYXN0ZXJGaXJzdENvdXJzZSA9IDQ7XHJcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZSA9IDU7XHJcbmNvbnN0IFJFSkVDVEVEID0gMjtcclxuY29uc3QgQVBQUk9WRUQgPSAxO1xyXG5jb25zdCBBUFBMWSA9IDA7XHJcbmNvbnN0IENPTkZJRyA9IHJlcXVpcmUoJy4uLy4uL2NvbmZpZy9yZWxfY29uZmlnJyk7XHJcbnZhciBNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuR3JvdXBzID0gW107XHJcbiAgICB0aGlzLlN0dWRlbnRzID0gW107XHJcbiAgICB0aGlzLkNvdXJzZXMgPSBbXTtcclxuICAgIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSBbXTtcclxuICAgIHRoaXMuT3JnYW5pc2F0aW9ucyA9IFtdO1xyXG5cclxufTtcclxuXHJcbmNsYXNzIENvdXJzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lQ291cnNlKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lQ291cnNlID0gbmFtZUNvdXJzZTtcclxuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEdyb3VwKGdyb3VwKSB7XHJcbiAgICAgICAgdGhpcy5ncm91cHMucHVzaChncm91cCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEdyb3VwIHtcclxuICAgIGNvbnN0cnVjdG9yKHVpZF9MREFQLCBuYW1lR3JvdXApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lR3JvdXA7XHJcbiAgICAgICAgdGhpcy51aWRfTERBUCA9IHVpZF9MREFQO1xyXG4gICAgICAgIHRoaXMuc3R1ZGVudHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTdHVkZW50KHN0dWRlbnQpIHtcclxuICAgICAgICB0aGlzLnN0dWRlbnRzLnB1c2goc3R1ZGVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0RGF0YSA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3VwcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucykge1xyXG4gICAgbGV0IGRhdGEgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2ssICsrbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1N0dWRlbnRBcHBseSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaCh7Z3JvdXA6IHRoaXMuR3JvdXBzW2ldLm5hbWV9KTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9ICcgJztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMubGVuZ3RoOyArK3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddLmxlbmd0aDsgKytuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID09PSArcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9yZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50ID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnRfVUlEID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10udWlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3N0YXR1cyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0YXR1cyA9IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0ubmFtZV9vcmdhbmlzYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3R1ZGVudEFwcGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiArPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLm5hbWVfb3JnYW5pc2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcsICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3R1ZGVudEFwcGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1N0dWRlbnRBcHBseSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnRfVUlEID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10udWlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9IFwi0J3QtSDQt9Cw0L/QuNGB0LDQu9GB0Y9cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRQcmFjdGljZUJ5SWQgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRfcHJhY3RpY2UpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9IFwiP2lkPVwiICsgc2VsZWN0ZWRfcHJhY3RpY2U7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZS1ieS1wcmFjdGljZS1pZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiBwcmFjdGljZTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL2dyb3VwcycpO1xyXG4gICAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgbGV0IGdyb3VwcyA9IGxpc3QuX2VtYmVkZGVkLmdyb3VwcztcclxuICAgIHJldHVybiBncm91cHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSBcIj9pZF9wcmFjdGljZT1cIlxyXG4gICAgICAgICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9ncm91cHMtYnktcHJhY3RpY2UtaWQnICsgaW5mbywgcGFyYW1zKTtcclxuICAgIGxldCBncm91cHNfdWlkcyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gZ3JvdXBzX3VpZHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzTmFtZUJ5R3JvdXBzVUlEID0gYXN5bmMgZnVuY3Rpb24gKHVpZHNHcm91cHMpIHtcclxuICAgIGxldCBncm91cHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdWlkc0dyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgaWYgKCt1aWRzR3JvdXBzW2ldLnVpZF9ncm91cCA9PT0gdGhpcy5Hcm91cHNbal0udWlkX0xEQVApIHtcclxuICAgICAgICAgICAgICAgIGdyb3Vwcy5wdXNoKHRoaXMuR3JvdXBzW2pdLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuLyrQv9C+0LvRg9GH0LDQtdC8INGB0YLRg9C00LXQvdGC0L7QsiDQuNC3INGF0YDQsNC90LjQu9C40YnQsCBMREFQINC/0L4gSUQg0LPRgNGD0L/Qv9GLKi9cclxuLypNb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNCeUdyb3VwSWQgPSBhc3luYyBmdW5jdGlvbiAoZ3JvdXBJRCkge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzLycgKyBncm91cElEKTtcclxuICBsZXQgbGlzdCA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgbGV0IHN0dWRlbnRzTGlzdCA9IGxpc3QuX2VtYmVkZGVkLnN0dWRlbnRzO1xyXG4gIHJldHVybiBzdHVkZW50c0xpc3Q7XHJcbn07Ki9cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5VUlEID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzX2luZm8pIHtcclxuICAgIGxldCBzdHVkZW50cyA9IFtdLCB1cmxzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzX2luZm8ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICB1cmxzLnB1c2goJy9wcm94eS9jb3JlL3YxL3Blb3BsZS8nICsgc3R1ZGVudHNfaW5mb1tpXS51aWRfc3R1ZGVudCk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgIClcclxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICAgICAgKSlcclxuICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzTGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiByZXN1bHRzW2ldLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX25hbWU6IHJlc3VsdHNbaV0uX2xpbmtzLmdyb3Vwc1swXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX1VJRDogcmVzdWx0c1tpXS5fbGlua3MuZ3JvdXBzWzBdLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVfY3JlYXRpb25fcmVxdWVzdDogc3R1ZGVudHNfaW5mb1tpXS5kYXRlX2NyZWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkX3JlcXVlc3Q6IHN0dWRlbnRzX2luZm9baV0uaWRfcmVxdWVzdCxcclxuICAgICAgICAgICAgICAgICAgICB1aWRfc3R1ZGVudDogc3R1ZGVudHNfaW5mb1tpXS51aWRfc3R1ZGVudCxcclxuICAgICAgICAgICAgICAgICAgICBpZF9vcmdhbmlzYXRpb246IHN0dWRlbnRzX2luZm9baV0uaWRfb3JnYW5pc2F0aW9uXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzRnJvbUxEQVAgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5nZXRHcm91cHMoKTtcclxuICAgIGxldCB1cmxzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuR3JvdXBzLnB1c2gobmV3IEdyb3VwKGdyb3Vwc1tpXS5pZCwgZ3JvdXBzW2ldLm5hbWUpKTtcclxuICAgICAgICB1cmxzLnB1c2goJy9wcm94eS9jb3JlL3YxL2dyb3Vwcy8nICsgZ3JvdXBzW2ldLmlkKTtcclxuICAgIH1cclxuICAgIGF3YWl0IHRoaXMuZ2V0U3R1ZGVudHNCeUdyb3VwSWRzKHVybHMpO1xyXG59O1xyXG5cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5R3JvdXBJZHMgPSBhc3luYyBmdW5jdGlvbiAodXJscykge1xyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICApXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgICAgICkpXHJcbiAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc0xlbmd0aCA9IHJlc3VsdHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3R1ZGVudHMgPSByZXN1bHRzW2ldLl9lbWJlZGRlZC5zdHVkZW50cztcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0TGVuZ3RoID0gc3R1ZGVudHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdExlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0dWRlbnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogc3R1ZGVudHNbal0uZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd1aWQnOiBzdHVkZW50c1tqXS51aWRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLnB1c2goc3R1ZGVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRDdXJyZW50WWVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBjdXJyZW50WWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIGN1cnJlbnRZZWFyO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmRpc3RyaWJ1dGVHcm91cHNCeUNvdXJzZXMgPSBhc3luYyBmdW5jdGlvbiAoY3VycmVudFllYXIpIHtcclxuICAgIHRoaXMuQ291cnNlcyA9IFtcclxuICAgICAgICBuZXcgQ291cnNlKCcxJyksXHJcbiAgICAgICAgbmV3IENvdXJzZSgnMicpLFxyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzMnKSxcclxuICAgICAgICBuZXcgQ291cnNlKCc0JyksXHJcbiAgICAgICAgbmV3IENvdXJzZSgnMSAo0LzQsyknKSxcclxuICAgICAgICBuZXcgQ291cnNlKCcyICjQvNCzKScpXHJcbiAgICBdO1xyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGlmICgrY3VycmVudE1vbnRoIDwgU0VQVEVNQkVSKSB7XHJcbiAgICAgICAgY3VycmVudFllYXIgLT0gMTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1ttYXN0ZXJGaXJzdENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRZZWFyLS07XHJcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1ttYXN0ZXJTZWNvbmRDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW3NlY29uZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFllYXItLTtcclxuICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW3RoaXJkQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbZm91cnRoQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50WWVhciArPSAzO1xyXG4gICAgfVxyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAoaW5mb19hYm91dF9wcmFjdGljZSkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGluZm9fYWJvdXRfcHJhY3RpY2UgPSBcIj95ZWFyPVwiICsgaW5mb19hYm91dF9wcmFjdGljZS55ZWFyICsgXCImZWR1X2xldmVsPVwiXHJcbiAgICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLmVkdV9sZXZlbCArIFwiJnR5cGVQcmFjdGljZT1cIlxyXG4gICAgICAgICsgaW5mb19hYm91dF9wcmFjdGljZS50eXBlUHJhY3RpY2U7XHJcbiAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLCBwYXJhbXMpXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGluZm8gPSByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIHJldHVybiBpbmZvO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdEJ5U3R1ZGVudFVJRCA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSwgc3R1ZGVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gJz91aWQ9JyArIHN0dWRlbnQudWlkICsgXCImaWRfcHJhY3RpY2U9XCJcclxuICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcmVxdXN0LWJ5LXN0dWRlbnQtdWlkJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgcmVxdWVzdCA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gcmVxdWVzdDtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVJZE9yZ2FuaXNhdGlvbkluUmVxdWVzdCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdCArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICAgICsgc3R1ZGVudC5pZF9vcmdhbmlzYXRpb247XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdCcgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBncm91cHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgcmVxdWVzdHMgPSBbXTtcclxuICAgIGxldCB1cmxzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmZvID0gJz9pZF9zdHVkZW50PScgKyBncm91cHNbaV0uc3R1ZGVudHNbal0udWlkICsgXCImaWRfcHJhY3RpY2U9XCJcclxuICAgICAgICAgICAgICAgICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICAgICAgICAgIHVybHMucHVzaCgnL3JlcXVzdHMtYnktc3R1ZGVudC1wcmFjdGljZScgKyBpbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgIClcclxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICAgICAgKSlcclxuICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHJlc3VsdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gcmVxdWVzdHM7Ly/Qv9C+0LvRg9GH0LjQu9C4IGFsbCDQt9Cw0Y/QstC+0Log0YHRgtGD0LTQtdC90YLQvtCyINCy0YvQsdGA0LDQvdC90YvRhSDQs9GA0YPQv9C/XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0cywgZ3JvdXBzKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IGdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7ICsraykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHMubGVuZ3RoOyArK24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZCA9PT0gcmVxdWVzdHNbbl0udWlkX3N0dWRlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3QgPSByZXF1ZXN0c1tuXS5pZF9yZXF1ZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzW25dLmlkX29yZ2FuaXNhdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX29yZ2FuaXNhdGlvbiA9IHJlcXVlc3RzW25dLmlkX29yZ2FuaXNhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJscy5wdXNoKCcvb3JnYW5pc2F0aW9ucy1ieS1yZXF1ZXN0JyArICc/aWRfcmVxdWVzdD0nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgICAgICApKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdC5wdXNoKHJlc3VsdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0O1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdEJ5U3R1ZGVudFVJRFMgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UsIHN0dWRlbnRzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGxldCByZXF1ZXN0cyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHVybHMucHVzaCgnL3JlcXVzdC1ieS1zdHVkZW50LXVpZCcgKyAnP3VpZD0nICsgc3R1ZGVudHNbaV0udWlkXHJcbiAgICAgICAgICAgICsgXCImaWRfcHJhY3RpY2U9XCJcclxuICAgICAgICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZSk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgICAgICApKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RzLnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdHM7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRQcmFjdGljZVllYXJzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcveWVhcnMtcHJhY3RpY2UnKTtcclxuICAgIGxldCB5ZWFycyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4geWVhcnM7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRQcmFjdGljZXMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9hbGwtcHJhY3RpY2VzJyk7XHJcbiAgICBsZXQgcHJhY3RpY2VzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiBwcmFjdGljZXM7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRUeXBlc1ByYWN0aWNlcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3R5cGVzLXByYWN0aWNlcycpO1xyXG4gICAgbGV0IHR5cGVzX3ByYWN0aWNlcyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gdHlwZXNfcHJhY3RpY2VzO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHNPcmdhbmlzYXRpb25zQnlSZXF1ZXN0SWQgPSBhc3luYyBmdW5jdGlvbiAocmVxdWVzdHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG4gICAgbGV0IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWVzdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB1cmxzLnB1c2goJy9vcmdhbmlzYXRpb25zLWJ5LXJlcXVlc3QnICsgJz9pZF9yZXF1ZXN0PScgKyByZXF1ZXN0c1tpXS5pZF9yZXF1ZXN0KTtcclxuICAgIH1cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICApXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgICAgICkpXHJcbiAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucy5wdXNoKHJlc3VsdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnM7XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgQ1JFQVRJT05cclxuIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzdWJJRCA9IFwiNTcyMzhiZDktMzZlOC00ZDg0LTgxNjAtZWI0YWQ5NTdhODQxXCI7XHJcbiAgICBsZXQgdXNlclRva2VuID0gZ2V0VXNlclRva2VuKCksIHVzZXI9MDtcclxuICAgIGlmICghdXNlclRva2VuKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gQ09ORklHLm5vX3Rva2VuX2xvY2F0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBzdWJJRCA9IEpTT04ucGFyc2UoYXRvYih1c2VyVG9rZW4uc3BsaXQoJy4nKVsxXSkpLnN1YjtcclxuICAgICAgdXNlcj0gIGF3YWl0IHRoaXMuZ2V0VXNlckluZm8oc3ViSUQpO1xyXG4gICAgfVxyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgLyogbGV0IGluZm8gPSAnP3VzZXJUeXBlPScgKyB1c2VyLnR5cGVVc2VyO1xyXG4gICAgYXdhaXQgZmV0Y2goJy91c2VyLWNhYmluZXQnICsgaW5mbywgcGFyYW1zKTsqL1xyXG4vKiAgICBpZiAodXNlci50eXBlVXNlciA9PT0gXCLQn9GA0LXQv9C+0LTQsNCy0LDRgtC10LvRjFwiKXtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKCcuL2luZGV4Lmh0bWwnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKCcuL3N0dWRlbnRfY2FiaW5ldC5odG1sICcpXHJcbiAgICB9Ki9cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRVc2VySW5mbyA9IGFzeW5jIGZ1bmN0aW9uIChzdWJJRCkge1xyXG4gICAgbGV0IHVzZXIgPSB7fTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvcGVvcGxlLz91aWQ9JyArIHN1YklEKTtcclxuICAgIGxldCBzdWJqZWN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGxldCB0eXBlX3VzZXIgPSBzdWJqZWN0Ll9lbWJlZGRlZC5wZW9wbGVbXCIwXCJdLnRpdGxlO1xyXG4gICAgaWYgKHR5cGVfdXNlci5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICB0eXBlX3VzZXIgPSBzdWJqZWN0Ll9lbWJlZGRlZC5wZW9wbGVbXCIwXCJdLnRpdGxlWzFdO1xyXG4gICAgfVxyXG4gICAgbGV0IGdpdmVuTmFtZSA9IHN1YmplY3QuX2VtYmVkZGVkLnBlb3BsZVtcIjBcIl0uZ2l2ZW5OYW1lO1xyXG4gICAgbGV0IHNuID0gc3ViamVjdC5fZW1iZWRkZWQucGVvcGxlW1wiMFwiXS5zbjtcclxuICAgIHVzZXIuZmlyc3ROYW1lID0gZ2l2ZW5OYW1lO1xyXG4gICAgdXNlci5sYXN0TmFtZSA9IHNuO1xyXG4gICAgdXNlci50eXBlVXNlciA9IHR5cGVfdXNlcjtcclxuICAgIHJldHVybiB1c2VyO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0VXNlclRva2VuKCkge1xyXG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyLXRva2VuJyk7XHJcbn1cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSBbXTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3R5cGVzLW9yZ2FuaXNhdGlvbicpO1xyXG4gICAgbGV0IHR5cGVzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSB0eXBlcztcclxuICAgIHJldHVybiB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9ucycpO1xyXG4gICAgbGV0IG9yZ3MgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgdGhpcy5PcmdhbmlzYXRpb25zID0gb3JncztcclxuICAgIHJldHVybiB0aGlzLk9yZ2FuaXNhdGlvbnM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZCA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9wcmFjdGljZT0nICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zLWJ5LXByYWN0aWNlJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25CeUlkID0gYXN5bmMgZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP2lkPScgKyBpZDtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi1ieS1pZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP2lkX3ByYWN0aWNlPScgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVlc3RzLWJ5LXByYWN0aWNlJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgcmV0dXJuIHJlcXVlc3RzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzQnlQcmFjdGljZUlkX09yZ2FuaXNhdGlvbklkID0gYXN5bmMgZnVuY3Rpb24gKGlkUHJhY3RpY2UsIGlkT3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP2lkX3ByYWN0aWNlPScgKyBpZFByYWN0aWNlICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICAgKyBpZE9yZ2FuaXNhdGlvbjtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVlc3RzLWJ5LWlkcHJhY3RpY2UtaWRvcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxuICAgIGxldCByZXF1ZXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGlmIChyZXF1ZXN0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHNCeU9yZ2FuaXNhdGlvbklkID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmFjdGljZSwgaXNBcHByb3ZlZCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gMCwgU1RBVFVTO1xyXG4gICAgaWYgKCFpc0FwcHJvdmVkKSB7XHJcbiAgICAgICAgaW5mbyA9IFwiP2lkX3ByYWN0aWNlPVwiICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICAgICAgU1RBVFVTID0gMDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGluZm8gPSBcIj9pZF9wcmFjdGljZT1cIiArIHByYWN0aWNlLmlkX3ByYWN0aWNlICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICAgICAgICsgb3JnYW5pc2F0aW9uLmlkO1xyXG4gICAgICAgIFNUQVRVUyA9IDE7XHJcbiAgICB9XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9yZXF1ZXN0cy1ieS1wcmFjdGljZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IHJlcXVlc3RzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGxldCBzdHVkZW50cyA9IFtdO1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWVzdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB1cmxzLnB1c2goXCIvZXhpc3QtcmVxdWVzdD9pZF9yZXF1ZXN0PVwiICsgcmVxdWVzdHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICAgICAgICArIG9yZ2FuaXNhdGlvbi5pZCk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgICAgICApKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXNMZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXNMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbaV0gIT09ICdOb3QgZm91bmQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbaV0uaWRfc3RhdHVzID09PSBTVEFUVVMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9yZXF1ZXN0OiByZXN1bHRzW2ldLmlkX3JlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9vcmdhbmlzYXRpb246IHJlc3VsdHNbaV0uaWRfb3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRfc3RhdHVzOiByZXN1bHRzW2ldLmlkX3N0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZF9zdHVkZW50OiByZXF1ZXN0c1tpXS51aWRfc3R1ZGVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3ByYWN0aWNlOiByZXF1ZXN0c1tpXS5pZF9wcmFjdGljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3JldmlldzogcmVxdWVzdHNbaV0uaWRfcmV2aWV3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZV9jcmVhdGlvbjogcmVzdWx0c1tpXS5kYXRlX2NyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZSA9IGFzeW5jIGZ1bmN0aW9uIChuYW1lT3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP25hbWU9JyArIG5hbWVPcmdhbmlzYXRpb247XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tYnktbmFtZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldERldGVybWluZWRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBkZXRlcm1pbmVkR3JvdXBzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGRldGVybWluZWRHcm91cHMucHVzaCh0aGlzLkdyb3Vwc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGV0ZXJtaW5lZEdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tY3JlYXRlJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob3JnYW5pc2F0aW9uKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9uLXVwZGF0ZScsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbilcclxuICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByYWN0aWNlKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQv9GA0LDQutGC0LjQutC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlT3JVcGRhdGVTdHVkZW50cyA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvc3R1ZGVudHMnLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzdHVkZW50cylcclxuICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40LggdWlkINGB0YLRg9C00LXQvdGC0L7QsiDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHZhciBjdXJyZW50RGF0ZSA9IGRhdGUuZm9ybWF0KFwieXl5eS1tbS1kZFwiKTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3RcclxuICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICAgKyBzdHVkZW50LmlkX3N0YXR1cyArIFwiJmRhdGVfY3JlYXRpb249XCJcclxuICAgICAgICArIGN1cnJlbnREYXRlO1xyXG4gICAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCB1cmxzID0gW107XHJcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICB2YXIgY3VycmVudERhdGUgPSBkYXRlLmZvcm1hdChcInl5eXktbW0tZGRcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnRzW2ldLmlkX3JlcXVlc3RcclxuICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgICAgICAgKyBzdHVkZW50c1tpXS5pZF9zdGF0dXMgKyBcIiZkYXRlX2NyZWF0aW9uPVwiXHJcbiAgICAgICAgICAgICsgY3VycmVudERhdGU7XHJcbiAgICAgICAgdXJscy5wdXNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uJyArIGluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uQnlSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdCArIFwiJmlkX3N0YXR1cz1cIlxyXG4gICAgICAgICsgc3R1ZGVudC5pZF9zdGF0dXMgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbjtcclxuICAgIGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uLWJ5LXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uQnlSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbiArIFwiJmlkX3N0YXR1cz1cIlxyXG4gICAgICAgICAgICArIHN0dWRlbnRzW2ldLmlkX3N0YXR1cztcclxuICAgICAgICB1cmxzLnB1c2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24tYnktcmVxdWVzdCcgKyBpbmZvKTtcclxuICAgIH1cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmluc2VydFJlcXVlc3RPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHZhciBjdXJyZW50RGF0ZSA9IGRhdGUuZm9ybWF0KFwieXl5eS1tbS1kZFwiKTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9vcmdhbmlzYXRpb249XCJcclxuICAgICAgICArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiICsgc3R1ZGVudC5pZF9zdGF0dXNcclxuICAgICAgICArIFwiJmRhdGVfY3JlYXRpb249XCJcclxuICAgICAgICArIGN1cnJlbnREYXRlO1xyXG4gICAgYXdhaXQgZmV0Y2goJy9pbnNlcnQtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICBpZiAoc3R1ZGVudC5pZF9zdGF0dXMgPT09IFJFSkVDVEVEKSB7XHJcbiAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPW51bGxcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdCcgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdHMgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICAgICAgaWYgKHN0dWRlbnRzW2ldLmlkX3N0YXR1cyA9PT0gUkVKRUNURUQpIHtcclxuICAgICAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249bnVsbFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVybHMucHVzaCgnL3VwZGF0ZS1yZXF1ZXN0JyArIGluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKGRvY3VtZW50LCB0eXBlX2RvY3VtZW50LCB0eXBlX3ByYWN0aWNlKSB7XHJcbiAgICBsZXQgaW5mb3JtYXRpb24gPSB7XHJcbiAgICAgICAgZGF0YTogZG9jdW1lbnQsXHJcbiAgICAgICAgdHlwZV9kb2N1bWVudDogdHlwZV9kb2N1bWVudCxcclxuICAgICAgICB0eXBlX3ByYWN0aWNlOiB0eXBlX3ByYWN0aWNlXHJcbiAgICB9O1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvZG9jdW1lbnQnLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShpbmZvcm1hdGlvbilcclxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICByZXR1cm4gcmVzcC5ibG9iKCk7XHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChibG9iKSB7XHJcbiAgICAgICAgc2F2ZUFzKGJsb2IsIHR5cGVfZG9jdW1lbnQgKyAnICcgKyB0eXBlX3ByYWN0aWNlICsgJyDQv9GA0LDQutGC0LjQutCwICcgKyBkb2N1bWVudC5ncm91cF9uYW1lICsgXCIuZG9jeFwiKTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQs9C10L3QtdGA0LDRhtC40Lgg0LTQvtC60YPQvNC10L3RgtCwIFwiICsgZXJyb3IpO1xyXG4gICAgfSk7XHJcbiAgICBkZWJ1Z2dlcjtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcclxuXHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL01vZGVsLmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBcInNlcnZlcl9wb3J0XCI6IDc3NzcsXHJcbiAgICBcInVzZV9wcm94eVwiOiBmYWxzZSxcclxuICAgIFwic3VwZXJ2aXNvcl9wYXRoXCI6IFwiL3N1cGVydmlzb3JfY2FiaW5ldFwiLFxyXG4gICAgXCJzdHVkZW50X3BhdGhcIjogXCIvc3R1ZGVudF9jYWJpbmV0XCIsXHJcbiAgICBcIm5vX3Rva2VuX2xvY2F0aW9uXCI6IFwiaHR0cDovL2VzYi5paXBvLnR1LWJyeWFuc2sucnUvYXV0aGVudGljYXRpb24vP3JlZGlyZWN0PWh0dHA6Ly9lc2IuaWlwby50dS1icnlhbnNrLnJ1L3ByYWN0aWNlL1wiLFxyXG4gICAgXCJvcmlnaW5fbG9jYXRpb25cIjogXCIvcHJhY3RpY2UvXCIsXHJcbiAgICBcImRiXCI6IFwicHJhY3RpY2VcIixcclxuICAgIFwicHJveHlcIjogXCJodHRwOi8vZXNiLmlpcG8udHUtYnJ5YW5zay5ydVwiXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjb25maWcvcmVsX2NvbmZpZy5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby5jc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbe1wibmFtZVwiOlwi0JzQntCQXCIsXCJmdWxsTmFtZVwiOlwiMDIuMDMuMDMgwqvQnNCw0YLQtdC80LDRgtC40YfQtdGB0LrQvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0Lgg0LDQtNC80LjQvdC40YHRgtGA0LjRgNC+0LLQsNC90LjQtSDQuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJwcm9maWxlXCI6XCLCq9Ci0LXRhdC90L7Qu9C+0LPQuNGPINC/0YDQvtCz0YDQsNC80LzQuNGA0L7QstCw0L3QuNGPwrtcIixcInR5cGVcIjpcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIn0se1wibmFtZVwiOlwi0J/QoNCYXCIsXCJmdWxsTmFtZVwiOlwiMDkuMDMuMDQgwqvQn9GA0L7Qs9GA0LDQvNC80L3QsNGPINC40L3QttC10L3QtdGA0LjRj8K7XCIsXCJwcm9maWxlXCI6XCLCq9Cg0LDQt9GA0LDQsdC+0YLQutCwINC/0YDQvtCz0YDQsNC80LzQvdC+LdC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcInR5cGVcIjpcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIn0se1wibmFtZVwiOlwi0JjQktCiLTFcIixcImZ1bGxOYW1lXCI6XCIwOS4wMy4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXCJwcm9maWxlXCI6XCLCq9Cf0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QvtC5INGC0LXRhdC90LjQutC4INC4INCw0LLRgtC+0LzQsNGC0LjQt9C40YDQvtCy0LDQvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFwidHlwZVwiOlwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwifSx7XCJuYW1lXCI6XCLQmNCS0KItMlwiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCLQkdCw0LrQsNC70LDQstGA0LjQsNGCXCJ9LHtcIm5hbWVcIjpcItCY0JLQoi0zXCIsXCJmdWxsTmFtZVwiOlwiMDkuMDMuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFwicHJvZmlsZVwiOlwiwqvQn9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90L7QuSDRgtC10YXQvdC40LrQuCDQuCDQsNCy0YLQvtC80LDRgtC40LfQuNGA0L7QstCw0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcInR5cGVcIjpcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIn0se1wibmFtZVwiOlwi0J/QoNCYICjQvNCzKVwiLFwiZnVsbE5hbWVcIjpcIjA5LjA0LjA0IMKr0J/RgNC+0LPRgNCw0LzQvNC90LDRjyDQuNC90LbQtdC90LXRgNC40Y/Cu1wiLFwicHJvZmlsZVwiOlwiwqvQn9GA0L7QtdC60YLQuNGA0L7QstCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzQvdC+LdC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcInR5cGVcIjpcItCc0LDQs9C40YHRgtGA0LDRgtGD0YDQsFwifSx7XCJuYW1lXCI6XCLQmNCS0KItMSAo0LzQsylcIixcImZ1bGxOYW1lXCI6XCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXCJwcm9maWxlXCI6XCLCq9Ca0L7QvNC/0YzRjtGC0LXRgNC90YvQuSDQsNC90LDQu9C40Lcg0Lgg0LjQvdGC0LXRgNC/0YDQtdGC0LDRhtC40Y8g0LTQsNC90L3Ri9GFwrtcIixcInR5cGVcIjpcItCc0LDQs9C40YHRgtGA0LDRgtGD0YDQsFwifSx7XCJuYW1lXCI6XCLQmNCS0KItMiAo0LzQsylcIixcImZ1bGxOYW1lXCI6XCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXCJwcm9maWxlXCI6XCLCq9CY0L3RhNC+0YDQvNCw0YbQuNC+0L3QvdC+0LUg0Lgg0L/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcInR5cGVcIjpcItCc0LDQs9C40YHRgtGA0LDRgtGD0YDQsFwifSx7XCJuYW1lXCI6XCLQkdCQ0KFcIixcImZ1bGxOYW1lXCI6XCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXCJwcm9maWxlXCI6XCLCq9CY0L3RhNC+0YDQvNCw0YbQuNC+0L3QvdC+0LUg0Lgg0L/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcInR5cGVcIjpcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIn1dXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvYXNzZXRzL2pzb24vZGF0YS5qc29uXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzdZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFHQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFqQkE7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZkE7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDbDFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7O0FBRUE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDajFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==