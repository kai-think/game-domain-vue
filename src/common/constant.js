const Constant = {

  BbsStatus: {
    Draft: 0,
    Published: 1,
    Deleted_By_User: -1,
    Deleted_By_Admin: -2,
  },

  BbsType: {
    Common: 0,
    Official: 1,
    Essence: 2,
    Activity: -1,
  },

  ActivityType: {
    NONE: 0,
    GUESS: 1,
    VOTE: 2,
    LUCK_DRAW: 3,
  },

  ActivityStatus: {
    CREATED: 0,
    START: 1,
    END: 2,
    CANCEL: -1,
  }
}

export default Constant;
