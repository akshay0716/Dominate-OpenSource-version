import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddEmployeesFormFields from "./../employees/AddEmployeesFormFields";
import { connect } from "react-redux";
import {
  addEmployeesAction,
  remove_errorss,
  getAllEmployeesWithAdmin,
  filterAllEmployeesByLevelAction,
  getAllEmployees,
} from "./../../../store/actions/employeeAction";
import { getAllRolesAction } from "./../../../store/actions/authAction";
import { validateAddEmployee } from "./../../../store/validations/employeeValidation/addEmployeeValidation";
//Customers date of joining pkges

import DatePicker from "react-datepicker";
import dateFns, { compareAsc } from "date-fns";
import isEmpty from "./../../../store/validations/is-empty";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import store from "./../../../store/store";
import { SET_FILTER_NAME, SET_EMPTY_ERRORS } from "./../../../store/types";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import UserDashboardFreePlanWarning from "./../user-dashboard-add-forms/UserDashboardFreePlanWarning";
import { workspace } from "../../../store/utils/enterprizeAccount.json";
import { workspaceId } from "../../../store/actions/config";

const allEmployeesOptions = [
  "All Members",
  "Archive Members",
  "Active Members",
];

const totalFormSlides = 4;

class AddEmployees extends Component {
  state = {
    open: false,
    prevNextIndex: 0,
    employeesFirstName: "",
    employeesLastName: "",
    employeesEmailId: "",
    // Date of joining form Fields
    selectedOption: "",
    employeesJobTitle: "",
    dateOfJoining: new Date(),
    empMonthlyTarget: "",
    empRole: {},
    errors: {},
    apiErrors: {},
    success: false,
    allEmployeesDefaultOption: allEmployeesOptions[0],
  };

  /*===============================
        Lifecycle Methods
  =================================*/

  componentDidMount() {
    this.props.getAllRolesAction();
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: this.state.allEmployeesDefaultOption,
    });
    // handle prev and next screen by keyboard
    document.addEventListener("keydown", this.handleMainDivKeyDown);
    this.setState({
      prevNextIndex: 0,
    });
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.apiError) &&
      nextProps.apiError !== nextState.apiErrors
    ) {
      return {
        apiErrors: nextProps.apiError,
      };
    }
    if (!isEmpty(nextProps.roles) && nextProps.roles !== nextState.empRole) {
      let updatedArray = nextProps.roles.filter(function (roles) {
        return roles.name === "Sales Manager";
      });
      let id = updatedArray[0]._id;
      // console.log(id);
      return {
        empRole: id,
      };
    }

    return null;
  }

  componentDidUpdate() {
    // console.log("component did upadate", this.state.apiErrors);
    if (
      this.props.apiStatus &&
      this.state.success &&
      !this.state.hasClosedModal
    ) {
      this.onCloseModal();
      this.setState({ hasClosedModal: true });
    }

    if (
      !isEmpty(this.state.apiErrors) &&
      this.state.apiErrors.statusCode === 400 &&
      !this.state.hasSetErrors &&
      isEmpty(this.state.errors)
    ) {
      const errors = {
        employeesEmailId:
          !isEmpty(this.props.validationError) &&
          this.props.validationError.message,
        // employeesEmailId: this.state.apiErrors.message
      };
      this.setState({
        prevNextIndex: 2,
        errors: errors,
        hasSetErrors: true,
      });
    }
  }

  componentWillUnmount() {
    // handle prev and next screen by keyboard
    document.removeEventListener("keydown", this.handleMainDivKeyDown);
    store.dispatch({
      type: SET_EMPTY_ERRORS,
    });
  }

  /*=============================
    Render AllEmployees filter
  ===============================*/
  onAllEmployeesDropdownSelect = (e) => {
    // console.log("Selected: " + e.value);
    this.setState({
      allEmployeesDefaultOption: e.value,
    });
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: e.value,
    });
    if (e.value === "All Members") {
      const allEmployeeQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {},
      };
      this.props.getAllEmployeesWithAdmin(allEmployeeQuery);
    } else if (e.value === "Archive Members") {
      const filterByLevel = {
        query: {
          status: "ARCHIVE",
        },
      };
      this.props.filterAllEmployeesByLevelAction(filterByLevel);
    } else if (e.value === "Active Members") {
      const filterByLevel = {
        query: {
          status: "ACTIVE",
        },
      };
      this.props.filterAllEmployeesByLevelAction(filterByLevel);
    } else {
      // console.log("not selected");
    }
  };

  renderEmployeesFilter = () => {
    return (
      <>
        <Dropdown
          className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
          options={allEmployeesOptions}
          value={this.state.allEmployeesDefaultOption}
          onChange={this.onAllEmployeesDropdownSelect}
        />
      </>
    );
  };

  /*===============================
    Customers Date pf joining handle
  ================================*/
  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        dateOfJoining: new Date(),
      });
    } else {
      this.setState({
        dateOfJoining: date,
      });
    }
    // let today = new Date();
    // if (date === null) {
    //   this.setState({
    //     dateOfJoining: today
    //   });
    // } else {
    //   if (
    //     compareAsc(
    //       dateFns.format(today, "MM/DD/YYYY"),
    //       dateFns.format(date, "MM/DD/YYYY")
    //     ) <= 0
    //   ) {
    //     this.setState({
    //       dateOfJoining: today
    //     });
    //   } else {
    //     this.setState({
    //       dateOfJoining: date
    //     });
    //   }
    // }
  };

  /*===============================
      Model Open Handlers
  =================================*/

  onOpenModal = () => {
    this.setState({ open: true, hasClosedModal: false, success: false });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      prevNextIndex: 0,
      employeesFirstName: "",
      employeesLastName: "",
      employeesEmailId: "",
      // Date of joining form Fields
      selectedOption: "",
      employeesJobTitle: "",
      dateOfJoining: new Date(),
      empMonthlyTarget: "",
      empRole: {},
      errors: {},
      apiErrors: {},
    });
  };

  /*==============================
      Form Events Handlers
  ================================*/

  handleChange = (e) => {
    this.props.remove_errorss();
    this.setState({
      errors: {},
      apiErrors: {},
      success: false,
      hasSetErrors: false,
      [e.target.name]: e.target.value,
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      this.handleSubmitFunctionMain();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.handleSubmitFunctionMain();
  };

  handleSubmitFunctionMain = () => {
    const { employeesFilterName } = this.props;
    const { errors, isValid } = validateAddEmployee(this.state);
    console.log(errors);
    if (!isValid) {
      this.setState({
        errors: errors,
      });
    }
    if (isValid) {
      const newEmployee = {
        email: this.state.employeesEmailId,
        firstName: this.state.employeesFirstName,
        lastName: this.state.employeesLastName,
        role: this.state.empRole,
        dateOfJoining: this.state.dateOfJoining,
        jobTitle: this.state.employeesJobTitle,
        targetedLeads: this.state.empMonthlyTarget,
      };
      this.props.addEmployeesAction(newEmployee, employeesFilterName);
      // if (isEmpty(this.state.apiErrors)) {
      //   this.onCloseModal();
      // }
      this.setState({
        success: true,
      });
    }
  };

  handleMainDivKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    // Shift + ArrowLeft
    if (e.ctrlKey && keyCode === 37) {
      this.handlePrev();
    }
    // Shift + ArrowRight
    if (e.ctrlKey && keyCode === 39) {
      this.handleNext();
    }
  };

  handlePrev = () => {
    this.setState({
      success: false,
      apiErrors: {},
      hasSetErrors: false,
      prevNextIndex:
        this.state.prevNextIndex > 0
          ? this.state.prevNextIndex - 1
          : this.state.prevNextIndex,
    });
  };

  // handle next on key enter
  onFormKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13 && this.state.prevNextIndex !== 4) {
      e.preventDefault();
      this.handleNext();
    }
  };

  handleNext = () => {
    const { errors, isValid } = validateAddEmployee(this.state);
    this.setState({
      success: false,
      apiErrors: {},
      hasSetErrors: false,
    });
    if (this.state.prevNextIndex === 0) {
      if (errors.employeesFirstName) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 1) {
      if (errors.employeesLastName) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 2) {
      if (errors.employeesEmailId) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 3) {
      if (errors.employeesJobTitle) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 5) {
      if (errors.empMonthlyTarget) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex,
          errors: {},
        });
      }
    } else {
      this.setState({
        prevNextIndex:
          this.state.prevNextIndex < totalFormSlides
            ? this.state.prevNextIndex + 1
            : this.state.prevNextIndex,
        errors: {},
      });
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*============================
    Render Add Employee Model
  =============================*/

  renderAddEmployeesForm = () => {
    const { open, prevNextIndex } = this.state;
    let errors = this.state.errors;
    // console.log(errors);

    // monthly target
    const monthlyTargetInputField = (
      <div className="mb-30">
        <label
          htmlFor="empMonthlyTarget"
          className="add-lead-label font-24-semibold"
        >
          Enter monthly target
        </label>
        <br />
        <div>
          <input
            type="text"
            pattern="[0-9]*"
            id="empMonthlyTarget"
            name="empMonthlyTarget"
            className="add-lead-input-field font-18-regular"
            placeholder="eg. 30"
            value={this.state.empMonthlyTarget}
            onChange={this.handleChangeNumber}
            autoFocus
            maxLength={10}
          />
          {errors.empMonthlyTarget && (
            <div className="is-invalid add-lead-form-field-errors">
              {errors.empMonthlyTarget}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <Modal
        open={open}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        <div className="add-lead-modal-container lead_page_component container-fluid pr-0">
          <h1 className="font-30-bold mb-61">New Member</h1>
          <AddLeadBlueProgressbar
            percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
            skipButtonFrom={5}
            prevNextIndex={prevNextIndex}
          />
          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={this.handlePrev}
                />*/}
                  <div className="add-lead-prev-icon" onClick={this.handlePrev}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                      alt="previous"
                    />
                  </div>
                </>
              )}

              {prevNextIndex >= totalFormSlides ? (
                ""
              ) : (
                <>
                  {/*<img
                    src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
                    alt="next"
                    className="add-lead-next-icon"
                    onClick={this.handleNext}
                  />*/}
                  <div className="add-lead-next-icon" onClick={this.handleNext}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                      alt="next"
                    />
                  </div>
                </>
              )}
            </div>
            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              onKeyDown={this.onFormKeyDown}
            >
              {/* Employe First Name Field */}
              {prevNextIndex === 0 ? (
                <AddEmployeesFormFields
                  type="text"
                  htmlFor={"employeesFirstName"}
                  labelName={"First Name of your new member?"}
                  id={"employeesFirstName"}
                  name={"employeesFirstName"}
                  placeholder={"Eg. Rajesh "}
                  onChange={this.handleChange}
                  value={this.state.employeesFirstName}
                  maxLength={maxLengths.char30}
                  error={errors.employeesFirstName}
                />
              ) : (
                ""
              )}

              {/* Employe Last Name Field */}
              {prevNextIndex === 1 ? (
                <AddEmployeesFormFields
                  type="text"
                  htmlFor={"employeesLastName"}
                  labelName={"Last Name of your new member?"}
                  id={"employeesLastName"}
                  name={"employeesLastName"}
                  placeholder={"Eg. Khanna"}
                  onChange={this.handleChange}
                  value={this.state.employeesLastName}
                  maxLength={maxLengths.char30}
                  error={errors.employeesLastName}
                />
              ) : (
                ""
              )}

              {/*Employee Email  field */}
              {prevNextIndex === 2 ? (
                <AddEmployeesFormFields
                  type="email"
                  htmlFor={"employeesEmailId"}
                  labelName={"Enter Email Iid"}
                  id={"employeesEmailId"}
                  name={"employeesEmailId"}
                  placeholder={"Eg. abc@gmail.com"}
                  onChange={this.handleChange}
                  value={this.state.employeesEmailId}
                  error={errors.employeesEmailId ? errors.employeesEmailId : ""}
                />
              ) : (
                ""
              )}

              {/*Employee Job Title  field */}
              {prevNextIndex === 3 ? (
                <AddEmployeesFormFields
                  type="text"
                  htmlFor={"employeesJobTitle"}
                  labelName={"Enter Job Title"}
                  id={"employeesJobTitle"}
                  name={"employeesJobTitle"}
                  placeholder={"Eg. Project manager"}
                  onChange={this.handleChange}
                  value={this.state.employeesJobTitle}
                  maxLength={maxLengths.char30}
                  error={errors.employeesJobTitle}
                />
              ) : (
                ""
              )}

              {/*Employee Date of joining  field */}
              {prevNextIndex === 4 ? (
                <Fragment>
                  <label
                    htmlFor="date"
                    className="add-lead-label font-24-semibold"
                  >
                    Select Date of Joining
                  </label>
                  <br />
                  <div className="d-flex align-items-center employees-dte-of-joining leads-title-block-container__date-picker mb-30">
                    <span
                      className="font-24-semibold mr-30"
                      role="img"
                      aria-labelledby="Tear-Off Calendar"
                    >
                      {/* calendar */}
                      {/* &#x1F4C6; */}
                    </span>
                    <DatePicker
                      minDate={new Date()}
                      selected={this.state.dateOfJoining}
                      onChange={this.handleChangeDate}
                      onChangeRaw={this.handleDateChangeRaw}
                      // dayClassName={date =>
                      //   compareAsc(
                      //     dateFns.format(new Date(), "MM/DD/YYYY"),
                      //     dateFns.format(date, "MM/DD/YYYY")
                      //   ) <= 0
                      //     ? "disabled-date"
                      //     : undefined
                      // }
                    />
                    {/* resolve tab in modal */}
                    <button className="opacity-0"></button>
                  </div>
                </Fragment>
              ) : (
                ""
              )}

              {/* {prevNextIndex === 5 && monthlyTargetInputField} */}

              {prevNextIndex === 4 ? (
                <div className="pt-25 text-right">
                  <button
                    // type="submit"
                    onClick={this.handleSubmit}
                    onKeyDown={this.handleSubmitOnKeyDown}
                    className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                  >
                    Save
                  </button>
                </div>
              ) : (
                ""
              )}
            </form>

            {/*<AddLeadBlueProgressbar
              percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
              skipButtonFrom={4}
              prevNextIndex={prevNextIndex}
            />*/}
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    let enterprizeMember = false;

    workspace.forEach((ele) => {
      if (ele.name === workspaceId) {
        enterprizeMember = true;
      }
    });

    let oraganiationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // console.log(this.props.userCount);
    const { userRole, userCount } = this.props;
    const classNameInMobile = this.props.isActive
      ? "font-24-bold floating-btn-options-block__link"
      : "resp-font-12-regular floating-btn-options-block__link";
    if (userCount <= 2) {
      return (
        <Fragment>
          {this.props.isMobile ? (
            <h6 className={classNameInMobile} onClick={this.onOpenModal}>
              &#43; New Team
            </h6>
          ) : (
            <>
              {userRole === "Administrator" && (
                <>
                  {userCount <= 1 ? (
                    <p className="font-21-regular mb-3">
                      add members to see scoreboard visualisations
                    </p>
                  ) : (
                    <p className="font-21-regular mb-3">
                      No other members found
                    </p>
                  )}

                  {userCount < 2 && (
                    <>
                      {/* {!isEmpty(oraganiationData) &&
                      oraganiationData.planStatus === "FREE_PLAN" &&
                      !enterprizeMember ? (
                        <UserDashboardFreePlanWarning
                          dashboardScorBoard={true}
                        />
                      ) : ( */}
                      <button
                        className="add-form-btn "
                        onClick={this.onOpenModal}
                      >
                        &#43; New Member
                      </button>
                      {/* )} */}
                    </>
                  )}
                </>
              )}
            </>
          )}
          {this.renderAddEmployeesForm()}
        </Fragment>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => ({
  roles: state.auth.roles,
  apiError: state.errors.errors,
  apiStatus: state.auth.status,
  employeesFilterName: state.filterName.filterName,
  userRole: state.auth.user.role.name,
  validationError: state.errors.errors,
});

export default connect(mapStateToProps, {
  addEmployeesAction,
  getAllRolesAction,
  remove_errorss,
  getAllEmployeesWithAdmin,
  filterAllEmployeesByLevelAction,
  getAllEmployees,
})(AddEmployees);
