import type { ComponentType } from 'react';
import { L01ExecutiveClassic } from './L01ExecutiveClassic';
import { L02TechnicalModern } from './L02TechnicalModern';
import { L03MinimalIvy } from './L03MinimalIvy';
import { L04CompactPro } from './L04CompactPro';
import { L05OperationsGrid } from './L05OperationsGrid';
import { L06SwissEditorial } from './L06SwissEditorial';
import { L07StudioSplit } from './L07StudioSplit';
import { L08TypographicBold } from './L08TypographicBold';
import { L09PortfolioLink } from './L09PortfolioLink';
import { L10AsymmetricNeo } from './L10AsymmetricNeo';
import type { LayoutProps } from './types';

/** One component per entry in data/layouts.ts, same order. */
export const LAYOUT_COMPONENTS: ComponentType<LayoutProps>[] = [
  L01ExecutiveClassic,
  L02TechnicalModern,
  L03MinimalIvy,
  L04CompactPro,
  L05OperationsGrid,
  L06SwissEditorial,
  L07StudioSplit,
  L08TypographicBold,
  L09PortfolioLink,
  L10AsymmetricNeo,
];
