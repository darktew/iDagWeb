import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import getPageContext  from "../src/getPageContext";
import withRedux from "next-redux-wrapper";
import initStore from "../src/store";
import "../styles/index.scss";

const MyApp = withRedux(initStore)(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      // const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : { ctx };
      return { 
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : { }
      };
    }
    constructor() {
      super();
      this.pageContext = getPageContext();
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector("#jss-server-side");
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      const { Component, pageProps, store } = this.props;
      return (
        <Container>
          <Head>
            <title>NextJS - With Redux and Material UI</title>
          </Head>
          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >
            <MuiThemeProvider
              theme={this.pageContext.theme}
            >
              <CssBaseline />
              <Provider store={store}>
                <Component
                  pageContext={this.pageContext}
                  {...pageProps}
                />
              </Provider>
            </MuiThemeProvider>
          </JssProvider>
        </Container>
      );
    }
  }
)

export default withRedux(initStore)(MyApp);
