import React, {Suspense, Fragment} from 'react';
import {
    AnyFramework,
    PartialStoryFn as StoryFunction,
    StoryContext,
} from '@storybook/csf';
import {useEffect, useRef, useState} from '@storybook/client-api';
import {I18nextProvider} from 'react-i18next';

export const withI18Next = (
    story: StoryFunction<AnyFramework>,
    context: StoryContext
) => {
    const {
        parameters: {i18n, locale},
    } = context;

    // const {locale} = context.globalsArgs;
    const [show, setShow] = useState(true);
    const timeoutRef = useRef(null);

    console.log('context.globalsArgs', context.globalsArgs);
    console.log('locale', locale);

    useEffect(() => {
        if (locale) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setShow(false);
            i18n?.changeLanguage(locale);
            timeoutRef.current = setTimeout(() => setShow(true), 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale]);

    if (i18n && show) {
        return (
            <Suspense fallback="Loading...">
                <Fragment key={locale}>
                    <I18nextProvider i18n={i18n}>
                        {story(context)}
                    </I18nextProvider>
                </Fragment>
            </Suspense>
        );
    }
    return story(context);
};
