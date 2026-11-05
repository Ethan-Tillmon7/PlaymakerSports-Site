import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { buttonClass, type ButtonStyle } from './buttonClass';
import { ArrowIcon } from './icons';

interface ArrowProp {
  /** A trailing arrow that nudges right on hover: for buttons that go somewhere. */
  arrow?: boolean;
}

type ButtonProps = ButtonStyle & ArrowProp & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export function Button({ variant, size, className, arrow, type = 'button', children, ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass({ variant, size, className })} {...props}>
      {children}
      {arrow && <ArrowIcon className="arrow" />}
    </button>
  );
}

type ButtonLinkProps = ButtonStyle & ArrowProp & Omit<LinkProps, 'className'>;

export function ButtonLink({ variant, size, className, arrow, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ variant, size, className })} {...props}>
      {children}
      {arrow && <ArrowIcon className="arrow" />}
    </Link>
  );
}
