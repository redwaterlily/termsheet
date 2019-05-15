import React from "react";
import { APIClient, Openlaw } from "openlaw";
import { Container, Loader, Button } from "semantic-ui-react";
import "openlaw-elements/dist/openlaw-elements.min.css";
import OpenLawForm from "openlaw-elements";
import AgreementPreview from "./AgreementPreview";
require("dotenv").config();

const COMPANY = "Company Name";
const COMPANY_ENTITY_STATUS = "Company Entity Status";
const COMPANY_ENTITY_TYPE = "Company Entity Type";
const COMPANY_JURISDICTION = "Company Jurisdiction";
const COMPANY_ADDRESS = "Company Address";
const COMPANY_SIGNATORY_TITLE = "Company Representative Title";
const COMPANY_SIGNATORY_EMAIL = "Company Representative Email";
const GOVERNING_LAW = "Governing Law";
const COMPANY_VALUATION = "Company Valuation";
const OFFERING_AMOUNT = "Offering Amount";
const SERIES_AA_CURRENCY = "SAFE Currency";
const NUMBER_OF_SHARES = "Number of Shares";
const PRICE_PER_SHARE = "Purchase Amount";
const POSTMONEY_VALUATION_CAP = "PostMoney Valuation Cap";
const EFFECTIVE_DATE = "Date of SAFE";
const INVESTOR = "Investor Name";
const INVESTOR_ADDRESS = "Investor Address";
const INVESTOR_SIGNATORY_TITLE = "Investor Representative Title";
const INVESTOR_SIGNATORY_EMAIL = "Investor Representative Email";

const openLawConfig = {
  server: "https://app.openlaw.io",
  templateName: "Y COMBINATOR SAFE",
  userName: "josh.ma91@gmail.com",
  password: "p!GJuNYiG.b6XCA"
};

console.log(openLawConfig.templateName);
const apiClient = new APIClient(openLawConfig.server);

class SAFE extends React.Component {
  //initial state of variables for Assignment Template, and web3,etc
  state = {
    // State variables for agreement

    compName: null,
    compStatus: null,
    compType: "Limited Liability Company",
    compJuris: "Delaware",
    compAddrs: null,
    compSign: null,
    compSignT: null,
    compEmail: null,
    govLaw: null,
    compVal: null,
    offAmnt: null,
    serCurr: null,
    numShares: null,
    prcShares: null,
    postCap: null,
    effDate: null,
    investName: null,
    investAdd: null,
    investTitle: null,
    investEmail: null,

    // State variables for OpenLaw
    title: "",
    template: "",
    creatorId: "",
    compiledTemplate: null,
    parameters: {},
    executionResult: null,
    variables: null,
    draftId: "",

    // State variables for preview component
    previewHTML: null,
    loading: false
  };

  componentDidMount = async () => {

    console.log(openLawConfig.userName);
    //const { web3, accounts, contract } = this.props;
    //create an instance of the API client with url as parameter
    apiClient
      .login(openLawConfig.userName, openLawConfig.password)
      .then(console.log);

    //Retrieve your OpenLaw template by name, use async/await
    const template = await apiClient.getTemplate(openLawConfig.templateName);
    console.log(template);

    //pull properties off of JSON and make into variables
    const title = template.title;

    //Retreive the OpenLaw Template, including MarkDown
    const content = template.content;
    console.log("template..", template);

    //Get the most recent version of the OpenLaw API Tutorial Template
    const versions = await apiClient.getTemplateVersions(
      openLawConfig.templateName,
      20,
      1
    );
    console.log("versions..", versions[0], versions.length);

    //Get the creatorID from the template.
    const creatorId = versions[0].creatorId;
    console.log("creatorId..", creatorId);

    //Get my compiled Template, for use in rendering the HTML in previewTemplate
    const compiledTemplate = await Openlaw.compileTemplate(content);
    if (compiledTemplate.isError) {
      throw "template error" + compiledTemplate.errorMessage;
    }
    console.log("my compiled template..", compiledTemplate);

    const parameters = {};
    const { executionResult, errorMessage } = await Openlaw.execute(
      compiledTemplate.compiledTemplate,
      {},
      parameters
    );

    console.log("execution result:", executionResult);

    // ** This is helpful for logging in development, or throwing exceptions at runtime.
    if (errorMessage) {
      console.error("Openlaw Execution Error:", errorMessage);
    }

    const variables = await Openlaw.getExecutedVariables(executionResult, {});
    console.log("variables:", variables);

    /*const contractStatus = await apiClient.loadContractStatus("08271c696c21b4bad780862a883ed668d9ca38d0c84c73ca57cca37a73e8e0a0");
    console.log("contract status", contractStatus); */

    this.setState({
      title,
      template,
      creatorId,
      compiledTemplate,
      parameters,
      executionResult,
      variables
    });
  };

  onChange = (key, value) => {
    switch (key) {
      case COMPANY:
        this.setState({ compName: value });
        break;
      case COMPANY_ENTITY_STATUS:
        this.setState({ compStatus: value });
        break;
      case COMPANY_ENTITY_TYPE:
        this.setState({ compType: value });
        break;
      case COMPANY_JURISDICTION:
        this.setState({ compJuris: value });
        break;
      case COMPANY_ADDRESS:
        this.setState({ compAddrs: value });
        break;
      case COMPANY_SIGNATORY_TITLE:
        this.setState({ compSignT: value });
        break;
      case COMPANY_SIGNATORY_EMAIL:
        this.setState({ compEmail: value });
        break;
      case COMPANY_VALUATION:
        this.setState({ compVal: value });
        break;
      case OFFERING_AMOUNT:
        this.setState({ offAmnt: value });
        break;
      case SERIES_AA_CURRENCY:
        this.setState({ serCurr: value });
        break;
      case NUMBER_OF_SHARES:
        this.setState({ numShares: value });
        break;
      case PRICE_PER_SHARE:
        this.setState({ prcShares: value });
        break;
      case POSTMONEY_VALUATION_CAP:
        this.setState({ postCap: value });
        break;
      case EFFECTIVE_DATE:
        this.setState({ effDate: value });
        break;
      case INVESTOR:
        this.setState({ investName: value });
        break;
      case INVESTOR_ADDRESS:
        this.setState({ investAdd: value });
        break;
      case INVESTOR_SIGNATORY_TITLE:
        this.setState({ investTitle: value });
        break;
      case INVESTOR_SIGNATORY_EMAIL:
        this.setState({ investEmail: value });
        break;
    }
    console.log("KEY:", key, "VALUE:", value);
  };
  setTemplatePreview = async () => {
    const {
      compName,
      compStatus,
      compType,
      compJuris,
      compAddrs,
      compSignT,
      compEmail,
      govLaw,
      compVal,
      offAmnt,
      serCurr,
      numShares,
      prcShares,
      postCap,
      effDate,
      investName,
      investAdd,
      investTitle,
      investEmail,
      compiledTemplate
    } = this.state;
    try {
      const params = {
        [COMPANY]: compName,
        [COMPANY_ENTITY_STATUS]: compStatus,
        [COMPANY_ENTITY_TYPE]: compType,
        [COMPANY_JURISDICTION]: compJuris,
        [COMPANY_ADDRESS]: compAddrs,
        [COMPANY_SIGNATORY_TITLE]: compSignT,
        [COMPANY_SIGNATORY_EMAIL]: compEmail,
        [GOVERNING_LAW]: govLaw,
        [COMPANY_VALUATION]: compVal,
        [OFFERING_AMOUNT]: offAmnt,
        [SERIES_AA_CURRENCY]: serCurr,
        [NUMBER_OF_SHARES]: numShares,
        [PRICE_PER_SHARE]: prcShares,
        [POSTMONEY_VALUATION_CAP]: postCap,
        [EFFECTIVE_DATE]: effDate,
        [INVESTOR]: investName,
        [INVESTOR_ADDRESS]: investAdd,
        [INVESTOR_SIGNATORY_TITLE]: investTitle,
        [INVESTOR_SIGNATORY_EMAIL]: investEmail
      };
      console.log(params);

      const executionResult = await Openlaw.execute(
        compiledTemplate.compiledTemplate,
        {},
        params
      );
      const agreements = await Openlaw.getAgreements(
        executionResult.executionResult
      );
      const previewHTML = await Openlaw.renderForReview(
        agreements[0].agreement,
        {}
      );

      this.setState({ previewHTML });
    } catch (error) {
      throw error;
    }
  };
  buildOpenLawParamsObj = async (template, creatorId) => {
    const {
      compName,
      compStatus,
      compType,
      compJuris,
      compAddrs,
      compSignT,
      compEmail,
      govLaw,
      compVal,
      offAmnt,
      serCurr,
      numShares,
      prcShares,
      postCap,
      effDate,
      investName,
      investAdd,
      investTitle,
      investEmail,
    } = this.state;

    const object = {
      templateId: template.id,
      title: template.title,
      text: template.content,
      creator: this.state.creatorId,
      parameters: {
        [COMPANY]: compName,
        [COMPANY_ENTITY_STATUS]: compStatus,
        [COMPANY_ENTITY_TYPE]: compType,
        [COMPANY_JURISDICTION]: compJuris,
        [COMPANY_ADDRESS]: compAddrs,
        [COMPANY_SIGNATORY_TITLE]: compSignT,
        [COMPANY_SIGNATORY_EMAIL]: compEmail,
        [GOVERNING_LAW]: govLaw,
        [COMPANY_VALUATION]: compVal,
        [OFFERING_AMOUNT]: offAmnt,
        [SERIES_AA_CURRENCY]: serCurr,
        [NUMBER_OF_SHARES]: numShares,
        [PRICE_PER_SHARE]: prcShares,
        [POSTMONEY_VALUATION_CAP]: postCap,
        [EFFECTIVE_DATE]: effDate,
        [INVESTOR]: investName,
        [INVESTOR_ADDRESS]: investAdd,
        [INVESTOR_SIGNATORY_TITLE]: investTitle,
        [INVESTOR_SIGNATORY_EMAIL]: investEmail
      },
      overriddenParagraphs: {},
      agreements: {},
      readonlyEmails: [],
      editEmails: [],
      draftId: this.state.draftId
    };
    return object;
  };

  onSubmit = async () => {
    try {
      //login to api
      this.setState({ loading: true }, async () => {
        apiClient.login(openLawConfig.userName, openLawConfig.password);
        console.log("apiClient logged in");

        //add Open Law params to be uploaded
        const uploadParams = await this.buildOpenLawParamsObj(
          this.state.template,
          this.state.creatorId
        );
        console.log("parmeters from user..", uploadParams.parameters);
        console.log("all parameters uploading...", uploadParams);

        //uploadDraft, sends a draft contract to "Draft Management", which can be edited.
        const draftId = await apiClient.uploadDraft(uploadParams);
        console.log("draft id..", draftId);

        const contractParams = {
          ...uploadParams,
          draftId
        };
        console.log(contractParams);

        const contractId = await apiClient.uploadContract(contractParams);
        console.log(contractId);

        await apiClient.sendContract([], [], contractId);

        this.timer = setInterval(async () => {
          const contractStatus = await apiClient.loadContractStatus(contractId);
          console.log("contract status", contractStatus);
          const sigArray = Object.keys(contractStatus.signatures);

          const finished = sigArray
            .map(email => {
              return contractStatus.signatures[email].done ? true : false;
            })
            .every(x => x);

          console.log(finished);

          if (finished) {
            apiClient.sendContract([], [], contractId);
            await this.setState({ loading: false });
            alert("Contract Successfully Executed")
            clearInterval(this.timer);
          }
        }, 2000);

        this.setState({ draftId });
      });


    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { variables, parameters, executionResult, previewHTML, loading } = this.state;
    if (!executionResult) return <Loader active />;
    return (
      <Container text style={{ marginTop: "2em" }}>
        <h1>SAFE TERM SHEET</h1>
        <OpenLawForm
          apiClient={apiClient}
          executionResult={executionResult}
          parameters={parameters}
          onChangeFunction={this.onChange}
          openLaw={Openlaw}
          variables={variables}
        />
        <Button onClick={this.setTemplatePreview}>Preview</Button>
        <Button primary loading={loading} onClick={this.onSubmit}>Submit</Button>
        <AgreementPreview previewHTML={previewHTML} />
      </Container>
    );
  }
}

export default SAFE;
