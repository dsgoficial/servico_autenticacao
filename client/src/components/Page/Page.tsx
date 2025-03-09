// Path: components\Page\Page.tsx
import React, { ReactNode, forwardRef } from 'react';
import { Box } from '@mui/material';

interface PageProps {
  children: ReactNode;
  title?: string;
  description?: string;
  meta?: React.DetailedHTMLProps<
    React.MetaHTMLAttributes<HTMLMetaElement>,
    HTMLMetaElement
  >[];
}

/**
 * Page component for consistent page structure and metadata handling
 */
const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = '', description = '', meta, ...other }, ref) => {
    const appTitle = title
      ? `${title} | Serviço de Autenticação`
      : 'Serviço de Autenticação';

    return (
      <>
        <title>{appTitle}</title>
        {description && <meta name="description" content={description} />}
        {meta && meta.map((item, index) => <meta key={index} {...item} />)}
        <Box ref={ref} sx={{ height: '100%' }} {...other}>
          {children}
        </Box>
      </>
    );
  },
);

export default Page;
