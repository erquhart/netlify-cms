import { getTheme, registerTheme } from 'Lib/registry';
import CollectionTop from './CollectionTop';
import Sidebar from './Sidebar';
import SidebarSearchInput from './SidebarSearchInput';
import SidebarLink from './SidebarLink';
import EntryListing from './EntryListing';
import EntryCardList from './EntryCardList';
import EntryCardGrid from './EntryCardGrid';

/**
 * Temporary: internally register default theme.
 */
registerTheme('collection_top', CollectionTop);
registerTheme('sidebar', Sidebar);
registerTheme('sidebar_search_input', SidebarSearchInput);
registerTheme('sidebar_link', SidebarLink);
registerTheme('entry_listing', EntryListing);
registerTheme('entry_card_list', EntryCardList);
registerTheme('entry_card_grid', EntryCardGrid);

const ThemeCollectionTop = getTheme('collection_top');
const ThemeSidebar = getTheme('sidebar');
const ThemeSidebarSearchInput = getTheme('sidebar_search_input');
const ThemeSidebarLink = getTheme('sidebar_link');
const ThemeEntryListing = getTheme('entry_listing');
const ThemeEntryCardList = getTheme('entry_card_list');
const ThemeEntryCardGrid = getTheme('entry_card_grid');

export {
  ThemeCollectionTop,
  ThemeSidebar,
  ThemeSidebarSearchInput,
  ThemeSidebarLink,
  ThemeEntryListing,
  ThemeEntryCardList,
  ThemeEntryCardGrid,
};
