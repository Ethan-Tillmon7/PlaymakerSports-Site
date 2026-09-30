import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { buttonClass, type ButtonStyle } from './buttonClass';

type ButtonProps = ButtonStyle & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ButtonStyle & Omit<LinkProps, 'className'>;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}
