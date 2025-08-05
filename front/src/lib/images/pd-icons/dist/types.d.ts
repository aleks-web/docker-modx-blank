import type { SVGAttributes } from 'svelte/elements';

export interface BaseProps extends SVGAttributes<SVGElement> {
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	color?: string | undefined | null;
	class?: string | undefined | null;
}
export interface OutlineBaseProps extends BaseProps {
	strokeWidth?: string | undefined | null;
}
export interface Props extends BaseProps {
	ariaLabel?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
export interface OutlineProps extends OutlineBaseProps {
	ariaLabel?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
