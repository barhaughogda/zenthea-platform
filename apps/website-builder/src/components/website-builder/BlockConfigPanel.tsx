'use client';

import React, { useState } from 'react';
import { Palette, Settings, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  BLOCK_METADATA,
  type BlockInstance,
  type BlockAppearance,
} from '@/lib/website-builder/schema';

// Appearance Forms
import { AppearanceConfigForm } from './block-config/appearance/AppearanceConfigForm';
import { FAQAppearanceControls } from './block-config/appearance/FAQAppearanceControls';
import { ButtonAppearanceForm } from './block-config/buttons/ButtonAppearanceForm';
import { HeroBackgroundConfigForm } from './block-config/hero/HeroBackgroundConfigForm';

// Content Forms
import { HeroConfigForm } from './block-config/hero/HeroConfigForm';
import { CareTeamConfigForm } from './block-config/content/CareTeamConfigForm';
import { ServicesConfigForm } from './block-config/content/ServicesConfigForm';
import { ContactConfigForm } from './block-config/content/ContactConfigForm';
import { CTABandConfigForm } from './block-config/content/CTABandConfigForm';
import { CustomTextConfigForm } from './block-config/content/CustomTextConfigForm';
import { FAQContentConfigForm } from './block-config/content/FAQContentConfigForm';
import { GenericConfigForm } from './block-config/content/GenericConfigForm';

interface BlockConfigPanelProps {
  block: BlockInstance | null;
  onUpdate: (props: Record<string, unknown>) => void;
  onAppearanceUpdate?: (appearance: BlockAppearance | undefined) => void;
  disabled?: boolean;
}

/**
 * Dispatcher map for content configuration forms
 */
const CONTENT_FORMS: Record<string, React.ComponentType<any>> = {
  'hero': HeroConfigForm,
  'care-team': CareTeamConfigForm,
  'services': ServicesConfigForm,
  'contact': ContactConfigForm,
  'cta-band': CTABandConfigForm,
  'custom-text': CustomTextConfigForm,
  'faq': FAQContentConfigForm,
};

export function BlockConfigPanel({
  block,
  onUpdate,
  onAppearanceUpdate,
  disabled,
}: Omit<BlockConfigPanelProps, 'onClose'>) {
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  if (!block) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select a block to configure</p>
        </div>
      </div>
    );
  }

  const metadata = BLOCK_METADATA[block.type];
  const blockProps = block.props as Record<string, unknown>;

  // Check if block has appearance customizations
  const hasAppearanceCustomizations: boolean = 
    (block.appearance?.backgroundToken !== 'default' && block.appearance?.backgroundToken !== undefined) ||
    (block.appearance?.textToken !== 'default' && block.appearance?.textToken !== undefined) ||
    Boolean(block.appearance?.backgroundCustom) ||
    Boolean(block.appearance?.textCustom) ||
    (block.type === 'hero' && (
      String(blockProps.backgroundType) !== 'gradient' ||
      Boolean(blockProps.backgroundImage) ||
      Boolean(blockProps.primaryButtonAppearance) ||
      Boolean(blockProps.secondaryButtonAppearance)
    ));

  const ConfigForm = CONTENT_FORMS[block.type] || GenericConfigForm;

  return (
    <div className="h-full flex flex-col">
      {/* Header - Block name and description */}
      <div className="px-4 py-3 border-b border-border-primary">
        <h3 className="font-semibold text-text-primary">{metadata.name}</h3>
        <p className="text-xs text-text-tertiary">{metadata.description}</p>
      </div>

      {/* Config Form */}
      <div className="flex-1 overflow-auto">
        {/* Content Configuration */}
        <div className="p-4">
          <ConfigForm props={blockProps} onUpdate={onUpdate} disabled={disabled} />
        </div>

        {/* Appearance Section (collapsible) */}
        {onAppearanceUpdate && (
          <div className="border-t border-border-primary">
            <Collapsible open={isAppearanceOpen} onOpenChange={setIsAppearanceOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-surface-secondary transition-colors">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-text-secondary" />
                  <span className="font-medium text-sm text-text-primary">Appearance</span>
                  {hasAppearanceCustomizations && (
                    <span className="w-2 h-2 rounded-full bg-interactive-primary" />
                  )}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-text-secondary transition-transform ${
                    isAppearanceOpen ? 'rotate-180' : ''
                  }`} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-6">
                  {/* FAQ Layout Controls */}
                  {block.type === 'faq' && (
                    <FAQAppearanceControls
                      props={blockProps}
                      onUpdate={onUpdate}
                      disabled={disabled}
                    />
                  )}
                  
                  {/* Hero blocks use consolidated background control */}
                  {block.type === 'hero' ? (
                    <HeroBackgroundConfigForm
                      props={blockProps}
                      onUpdate={onUpdate}
                      disabled={disabled}
                      appearance={block.appearance}
                      onAppearanceUpdate={onAppearanceUpdate}
                    />
                  ) : (
                    <AppearanceConfigForm
                      appearance={block.appearance}
                      onUpdate={onAppearanceUpdate}
                      disabled={disabled}
                    />
                  )}
                  
                  {/* Button Colors for Hero and CTA Band */}
                  {(block.type === 'hero' || block.type === 'cta-band') && (
                    <ButtonAppearanceForm
                      props={blockProps}
                      onUpdate={onUpdate}
                      disabled={disabled}
                    />
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlockConfigPanel;
