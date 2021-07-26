import React from 'react';
import pascalCase from './pascal-case'

interface Options<As extends React.ElementType = 'div'> {
  displayName?: string;
  Component?: As;
  defaultProps?: Partial<React.ComponentProps<As>>;
}

export default function createAs<As extends React.ElementType = 'div'>(
  prefix: string,
  options: Options<As> = {}
): React.ElementType {

  const {
    Component,
    defaultProps,
    displayName = pascalCase(prefix)
  } = options;

  const RefComponent = React.forwardRef(({
    className,
    as: As = Component || 'div',
    ...props
  }: Partial<React.ComponentProps<As>> = {},
    ref,
  ) => (
    <As ref={ref} className={`${prefix} ${className ?? ''}`.trim()} {...props} />
  ));

  RefComponent.displayName = displayName;
  RefComponent.defaultProps = defaultProps;

  return RefComponent;
}