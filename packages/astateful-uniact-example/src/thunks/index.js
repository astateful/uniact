import Artist from './artist';
import Public from './public';

export default dataSource => {
  return {
    artist: new Artist(dataSource),
    public: new Public(dataSource),
  };
};
