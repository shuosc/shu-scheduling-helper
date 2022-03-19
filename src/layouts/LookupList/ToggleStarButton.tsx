import React from 'react';
import { ActionButton, IconButton, IIconProps, TooltipHost } from '@fluentui/react';
import { ExtendedCourseKey } from '../../app/types';

const starIconProps: IIconProps = { iconName: 'AddFavorite' };

// const unstarIconProps: IIconProps = { iconName: 'Unfavorite' };

export interface ToggleStarButtonProps {
  courseKey: ExtendedCourseKey;
  loading?: boolean;
  iconOnly?: boolean;
}

const ToggleStarButton: React.FC<ToggleStarButtonProps> = ({ loading = false, iconOnly = false }) => {
  return iconOnly ? (
    <TooltipHost content="设为星标">
      <IconButton iconProps={starIconProps} disabled={loading} />
    </TooltipHost>
  ) : (
    <ActionButton text="设为星标" iconProps={starIconProps} disabled={loading} />
  );
};

export default ToggleStarButton;
