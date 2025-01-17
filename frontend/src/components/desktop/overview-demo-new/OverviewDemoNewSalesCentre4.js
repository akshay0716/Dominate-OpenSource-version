import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

import { connect } from "react-redux";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";

class OverviewDemoNewSalesCentre4 extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      redirectToCmd: false,
      redirectToReports: false,
    };
  }

  /*===============================
      Model Open Handlers
  =================================*/

  onOpenModal = () => {
    this.setState({
      open: true,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
    });
    localStorage.setItem("activeWalkthrough", "");
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "",
    });
  };

  onClickNext = () => {
    this.setState({
      open: false,
    });
    localStorage.setItem("activeWalkthrough", "");
    if (this.props.userRole === "Administrator") {
      this.setState({
        redirectToCmd: true,
      });
      store.dispatch({
        type: SET_WALKTHROUGH_PAGE,
        payload: "command-centre-1",
      });
    } else {
      this.setState({
        redirectToReports: true,
      });
      store.dispatch({
        type: SET_WALKTHROUGH_PAGE,
        payload: "reports-1",
      });
    }
  };

  /*=================================
      main
  ===================================*/
  render() {
    const { redirectToCmd, redirectToReports } = this.state;
    return (
      <Fragment>
        {redirectToCmd && <Redirect to="/command-centre" />}
        {redirectToReports && <Redirect to="/admin-reports" />}
        {/* content */}
        <Modal
          open={this.state.open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay customOverlay--walkthrough",
            modal:
              "customModal customModal--walkthrough customModal--walkthrough-sales-centre-4",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="overlay-new-walkthrough">
            <div className="new-walkthrough">
              <div className="row mx-0">
                <div className="col-11 px-0">
                  <h2 className="new-walkthrough__title font-24-semibold mb-25">
                    Now lastly lets take a look at Deals
                  </h2>
                  <p className="new-walkthrough__desc">
                    {/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in*/}
                    This is where your deal pipelines and their respective deals
                    will be . You can add and track them in their respective
                    pipelines.
                  </p>
                </div>
              </div>
              <div className="row mx-0">
                <div className="col-8 px-0">
                  <p className="new-walkthrough__click-here">
                    Click Next to go to Deals Section!
                  </p>
                  <div className="new-walkthrough__see-through-block ">
                    <button
                      className="new-walkthrough__button-white-border"
                      onClick={this.onClickNext}
                    >
                      Skip
                    </button>
                    <Link
                      to="/deal-pipelines"
                      onClick={() =>
                        store.dispatch({
                          type: SET_WALKTHROUGH_PAGE,
                          // payload: "deal-pipelines-1",
                          payload: "deal-pipelines-3",
                        })
                      }
                    >
                      <span className="new-walkthrough__button-white-border">
                        Next
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="col-4 px-0 text-right align-self-end">
                  <img
                    src={require("../../../assets/img/overview-demo-new/icons/sales-centre-4.svg")}
                    alt=""
                    className="new-walkthrough--sales-centre-4__img"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userRole: state.auth.user.role.name,
});

export default connect(mapStateToProps, {})(OverviewDemoNewSalesCentre4);
