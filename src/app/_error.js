// pages/_error.js
import NextErrorComponent from 'next/error';

const MyError = ({ statusCode, err }) => {
    return <NextErrorComponent statusCode={statusCode} err={err} />;
};

MyError.getInitialProps = async (context) => {
    const errorInitialProps = await NextErrorComponent.getInitialProps(context);
    const { res, err, asPath } = context;

    // Workaround for https://github.com/vercel/next.js/issues/8592
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

    return { statusCode, err };
};

export default MyError;
