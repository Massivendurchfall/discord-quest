(function() {
    "use strict";

    var logPrefix = "[QuestSpoofer]";

    function waitForWebpack(cb) {
        var i = setInterval(function() {
            if (window.webpackChunkdiscord_app && Array.isArray(window.webpackChunkdiscord_app)) {
                clearInterval(i);
                console.log(logPrefix, "webpackChunkdiscord_app detected, starting init");
                cb();
            }
        }, 100);
    }

    waitForWebpack(function() {
        delete window.$;

        var wpRequire;
        try {
            webpackChunkdiscord_app.push([[Symbol()], {}, function(r) { wpRequire = r; }]);
            webpackChunkdiscord_app.pop();
        } catch (e) {
            console.log(logPrefix, "Could not hook webpackChunkdiscord_app:", e);
            return;
        }

        if (!wpRequire || !wpRequire.c) {
            console.log(logPrefix, "wpRequire or its cache is not available");
            return;
        }

        console.log(logPrefix, "webpack cache size:", Object.keys(wpRequire.c).length);

        function getModule(name, filter) {
            console.log(logPrefix, "Searching module:", name);
            var cache = Object.values(wpRequire.c);
            var matches = 0;
            for (var i = 0; i < cache.length; i++) {
                var mod = cache[i];
                if (!mod || !mod.exports) continue;
                var exp = mod.exports;
                try {
                    if (filter(exp)) {
                        console.log(logPrefix, "Module found:", name, "id:", mod.id || "(no id)", "export keys:", Object.keys(exp));
                        return exp;
                    } else {
                        matches++;
                    }
                } catch (e) {}
            }
            console.log(logPrefix, "Module not found:", name, "checked exports:", matches);
            return null;
        }

        var ApplicationStreamingStoreExports = getModule("ApplicationStreamingStore", function(e) {
            return (e && e.Z && e.Z.__proto__ && typeof e.Z.__proto__.getStreamerActiveStreamMetadata === "function") ||
                   (e && e.A && e.A.__proto__ && typeof e.A.__proto__.getStreamerActiveStreamMetadata === "function");
        });

        if (!ApplicationStreamingStoreExports) {
            console.log(logPrefix, "ApplicationStreamingStore module not found, aborting");
            return;
        }

        var ApplicationStreamingStore = ApplicationStreamingStoreExports.Z || ApplicationStreamingStoreExports.A;
        var ApplicationStreamingStoreKey = ApplicationStreamingStoreExports.Z ? "Z" : "A";
        console.log(logPrefix, "ApplicationStreamingStore using exports key:", ApplicationStreamingStoreKey);

        if (!ApplicationStreamingStore || typeof ApplicationStreamingStore.getStreamerActiveStreamMetadata !== "function") {
            console.log(logPrefix, "ApplicationStreamingStore not usable, getStreamerActiveStreamMetadata missing");
            return;
        }

        var RunningGameStoreExports = getModule("RunningGameStore", function(e) {
            return (e && e.ZP && typeof e.ZP.getRunningGames === "function") ||
                   (e && e.Ay && typeof e.Ay.getRunningGames === "function");
        });
        if (!RunningGameStoreExports) {
            console.log(logPrefix, "RunningGameStore module not found, aborting");
            return;
        }
        var RunningGameStore = RunningGameStoreExports.ZP || RunningGameStoreExports.Ay;
        var RunningGameStoreKey = RunningGameStoreExports.ZP ? "ZP" : "Ay";
        console.log(logPrefix, "RunningGameStore using exports key:", RunningGameStoreKey);

        if (!RunningGameStore || typeof RunningGameStore.getRunningGames !== "function") {
            console.log(logPrefix, "RunningGameStore not usable, getRunningGames missing");
            return;
        }

        var QuestsStoreExports = getModule("QuestsStore", function(e) {
            return (e && e.Z && e.Z.__proto__ && typeof e.Z.__proto__.getQuest === "function") ||
                   (e && e.A && e.A.__proto__ && typeof e.A.__proto__.getQuest === "function");
        });
        if (!QuestsStoreExports) {
            console.log(logPrefix, "QuestsStore module not found, aborting");
            return;
        }
        var QuestsStore = QuestsStoreExports.Z || QuestsStoreExports.A;
        var QuestsStoreKey = QuestsStoreExports.Z ? "Z" : "A";
        console.log(logPrefix, "QuestsStore using exports key:", QuestsStoreKey);

        if (!QuestsStore || !QuestsStore.quests) {
            console.log(logPrefix, "QuestsStore not usable, quests map missing");
            return;
        }

        var ChannelStoreExports = getModule("ChannelStore", function(e) {
            return (e && e.Z && e.Z.__proto__ && typeof e.Z.__proto__.getAllThreadsForParent === "function") ||
                   (e && e.A && e.A.__proto__ && typeof e.A.__proto__.getAllThreadsForParent === "function");
        });
        if (!ChannelStoreExports) {
            console.log(logPrefix, "ChannelStore module not found, aborting");
            return;
        }
        var ChannelStore = ChannelStoreExports.Z || ChannelStoreExports.A;
        var ChannelStoreKey = ChannelStoreExports.Z ? "Z" : "A";
        console.log(logPrefix, "ChannelStore using exports key:", ChannelStoreKey);

        if (!ChannelStore) {
            console.log(logPrefix, "ChannelStore not usable");
            return;
        }

        var GuildChannelStoreExports = getModule("GuildChannelStore", function(e) {
            return (e && e.ZP && typeof e.ZP.getSFWDefaultChannel === "function") ||
                   (e && e.Ay && typeof e.Ay.getSFWDefaultChannel === "function");
        });
        if (!GuildChannelStoreExports) {
            console.log(logPrefix, "GuildChannelStore module not found, aborting");
            return;
        }
        var GuildChannelStore = GuildChannelStoreExports.ZP || GuildChannelStoreExports.Ay;
        var GuildChannelStoreKey = GuildChannelStoreExports.ZP ? "ZP" : "Ay";
        console.log(logPrefix, "GuildChannelStore using exports key:", GuildChannelStoreKey);

        if (!GuildChannelStore) {
            console.log(logPrefix, "GuildChannelStore not usable");
            return;
        }

        var FluxDispatcherExports = getModule("FluxDispatcher", function(e) {
            return (e && e.Z && e.Z.__proto__ && typeof e.Z.__proto__.flushWaitQueue === "function") ||
                   (e && e.h && e.h.__proto__ && typeof e.h.__proto__.flushWaitQueue === "function");
        });
        if (!FluxDispatcherExports) {
            console.log(logPrefix, "FluxDispatcher module not found, aborting");
            return;
        }
        var FluxDispatcher = FluxDispatcherExports.Z || FluxDispatcherExports.h;
        var FluxDispatcherKey = FluxDispatcherExports.Z ? "Z" : "h";
        console.log(logPrefix, "FluxDispatcher using exports key:", FluxDispatcherKey);

        if (!FluxDispatcher || typeof FluxDispatcher.dispatch !== "function") {
            console.log(logPrefix, "FluxDispatcher not usable, dispatch missing");
            return;
        }

        var apiExports = getModule("api", function(e) {
            return (e && e.tn && typeof e.tn.get === "function" && typeof e.tn.post === "function") ||
                   (e && e.Bo && typeof e.Bo.get === "function" && typeof e.Bo.post === "function");
        });
        if (!apiExports) {
            console.log(logPrefix, "api module not found, aborting");
            return;
        }
        var api = apiExports.tn || apiExports.Bo;
        var apiKey = apiExports.tn ? "tn" : "Bo";
        console.log(logPrefix, "api using exports key:", apiKey);

        if (!api || typeof api.get !== "function" || typeof api.post !== "function") {
            console.log(logPrefix, "api not usable, get/post missing");
            return;
        }

        var supportedTasks = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];
        var questsMap = QuestsStore.quests;
        if (!questsMap || typeof questsMap.values !== "function") {
            console.log(logPrefix, "QuestsStore.quests is not a Map, aborting");
            return;
        }

        var questsArray = [];
        questsMap.forEach(function(v) { questsArray.push(v); });

        console.log(logPrefix, "Total quests in store:", questsArray.length);

        var quests = questsArray.filter(function(x) {
            if (!x || !x.config || !x.userStatus) return false;
            if (!x.userStatus.enrolledAt || x.userStatus.completedAt) return false;
            if (!x.config.expiresAt) return false;
            if (new Date(x.config.expiresAt).getTime() <= Date.now()) return false;
            var taskConfig = x.config.taskConfig || x.config.taskConfigV2;
            if (!taskConfig || !taskConfig.tasks) return false;
            var keys = Object.keys(taskConfig.tasks);
            return supportedTasks.some(function(y) { return keys.includes(y); });
        });

        console.log(logPrefix, "Filtered active quests with supported tasks:", quests.length);

        var isApp = typeof DiscordNative !== "undefined";

        if (quests.length === 0) {
            console.log(logPrefix, "You don't have any uncompleted quests!");
            return;
        }

        function doJob() {
            var quest = quests.pop();
            if (!quest) {
                console.log(logPrefix, "No more quests in queue");
                return;
            }

            console.log(logPrefix, "Processing quest:", quest.id, quest.config && quest.config.messages && quest.config.messages.questName);

            var pid = Math.floor(Math.random() * 30000) + 1000;

            var applicationId = quest.config && quest.config.application && quest.config.application.id;
            var applicationName = quest.config && quest.config.application && quest.config.application.name;
            var questName = quest.config && quest.config.messages && quest.config.messages.questName;
            var taskConfig = quest.config.taskConfig || quest.config.taskConfigV2;
            if (!taskConfig || !taskConfig.tasks) {
                console.log(logPrefix, "Invalid taskConfig for quest", questName, "skipping");
                doJob();
                return;
            }

            var taskName = null;
            for (var i = 0; i < supportedTasks.length; i++) {
                var t = supportedTasks[i];
                if (taskConfig.tasks[t] != null) {
                    taskName = t;
                    break;
                }
            }

            if (!taskName) {
                console.log(logPrefix, "No supported task found for quest", questName, "skipping");
                doJob();
                return;
            }

            console.log(logPrefix, "Quest", questName, "task type:", taskName);

            var secondsNeeded = taskConfig.tasks[taskName].target;
            var secondsDone = (quest.userStatus && quest.userStatus.progress && quest.userStatus.progress[taskName] && quest.userStatus.progress[taskName].value) || 0;

            if (taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                var maxFuture = 10, speed = 7, interval = 1;
                var enrolledAt = new Date(quest.userStatus.enrolledAt).getTime();
                var completed = false;
                var fnVideo = async function() {
                    console.log(logPrefix, "Starting video spoof for quest", questName, "secondsNeeded:", secondsNeeded, "alreadyDone:", secondsDone);
                    while (true) {
                        var maxAllowed = Math.floor((Date.now() - enrolledAt) / 1000) + maxFuture;
                        var diff = maxAllowed - secondsDone;
                        var timestamp = secondsDone + speed;
                        if (diff >= speed) {
                            try {
                                var res = await api.post({ url: "/quests/" + quest.id + "/video-progress", body: { timestamp: Math.min(secondsNeeded, timestamp + Math.random()) } });
                                completed = !!(res && res.body && res.body.completed_at);
                                console.log(logPrefix, "Video progress tick for quest", questName, "seconds:", timestamp, "completed:", completed);
                            } catch (e) {
                                console.log(logPrefix, "Video progress request failed for quest", questName, "error:", e);
                            }
                            secondsDone = Math.min(secondsNeeded, timestamp);
                        }
                        if (timestamp >= secondsNeeded) {
                            break;
                        }
                        await new Promise(function(resolve) { setTimeout(resolve, interval * 1000); });
                    }
                    if (!completed) {
                        try {
                            await api.post({ url: "/quests/" + quest.id + "/video-progress", body: { timestamp: secondsNeeded } });
                            console.log(logPrefix, "Sent final video-progress for quest", questName);
                        } catch (e) {
                            console.log(logPrefix, "Final video progress request failed for quest", questName, "error:", e);
                        }
                    }
                    console.log(logPrefix, "Quest completed:", questName);
                    doJob();
                };
                fnVideo();
                console.log(logPrefix, "Spoofing video for", questName);
            } else if (taskName === "PLAY_ON_DESKTOP") {
                if (!isApp) {
                    console.log(logPrefix, "PLAY_ON_DESKTOP not available in browser, use desktop app for quest:", questName);
                } else {
                    console.log(logPrefix, "Fetching application data for PLAY_ON_DESKTOP quest", questName, "appId:", applicationId);
                    api.get({ url: "/applications/public?application_ids=" + applicationId }).then(function(res) {
                        if (!res || !res.body || !res.body[0]) {
                            console.log(logPrefix, "Could not get application data for quest", questName);
                            doJob();
                            return;
                        }
                        var appData = res.body[0];
                        if (!appData.executables || !appData.executables.length) {
                            console.log(logPrefix, "No executables found for application", appData.name, "quest", questName);
                            doJob();
                            return;
                        }
                        var exeWin = appData.executables.find(function(x) { return x.os === "win32"; }) || appData.executables[0];
                        var exeName = (exeWin.name || "").replace(">", "");

                        console.log(logPrefix, "Using executable", exeName, "for app", appData.name, "quest", questName);

                        var fakeGame = {
                            cmdLine: "C:\\\\Program Files\\\\" + appData.name + "\\\\" + exeName,
                            exeName: exeName,
                            exePath: "c:/program files/" + appData.name.toLowerCase() + "/" + exeName,
                            hidden: false,
                            isLauncher: false,
                            id: applicationId,
                            name: appData.name,
                            pid: pid,
                            pidPath: [pid],
                            processName: appData.name,
                            start: Date.now()
                        };

                        var realGames = RunningGameStore.getRunningGames();
                        var fakeGames = [fakeGame];
                        var realGetRunningGames = RunningGameStore.getRunningGames;
                        var realGetGameForPID = RunningGameStore.getGameForPID || function() { return null; };

                        RunningGameStore.getRunningGames = function() { return fakeGames; };
                        RunningGameStore.getGameForPID = function(p) { return fakeGames.find(function(x) { return x.pid === p; }); };
                        FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames });

                        console.log(logPrefix, "Injected fake running game for quest", questName);

                        var fn = function(data) {
                            if (!data || !data.userStatus) return;
                            var progress = quest.config.configVersion === 1
                                ? data.userStatus.streamProgressSeconds
                                : Math.floor(data.userStatus.progress && data.userStatus.progress.PLAY_ON_DESKTOP && data.userStatus.progress.PLAY_ON_DESKTOP.value || 0);
                            console.log(logPrefix, "Quest progress for", questName + ":", progress + "/" + secondsNeeded);

                            if (progress >= secondsNeeded) {
                                console.log(logPrefix, "Quest completed:", questName);

                                RunningGameStore.getRunningGames = realGetRunningGames;
                                RunningGameStore.getGameForPID = realGetGameForPID;
                                FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: [] });

                                if (typeof FluxDispatcher.unsubscribe === "function") {
                                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                }

                                doJob();
                            }
                        };

                        if (typeof FluxDispatcher.subscribe === "function") {
                            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                            console.log(logPrefix, "Subscribed to QUESTS_SEND_HEARTBEAT_SUCCESS for quest", questName);
                        } else {
                            console.log(logPrefix, "FluxDispatcher.subscribe not available");
                        }

                        console.log(logPrefix, "Spoofed your game to", applicationName, "for quest", questName, "wait about", Math.ceil((secondsNeeded - secondsDone) / 60), "more minutes");
                    }).catch(function(e) {
                        console.log(logPrefix, "Error fetching /applications/public for quest", questName, "error:", e);
                        doJob();
                    });
                }
            } else if (taskName === "STREAM_ON_DESKTOP") {
                if (!isApp) {
                    console.log(logPrefix, "STREAM_ON_DESKTOP not available in browser, use desktop app for quest:", questName);
                } else {
                    var realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
                    ApplicationStreamingStore.getStreamerActiveStreamMetadata = function() {
                        return {
                            id: applicationId,
                            pid: pid,
                            sourceName: null
                        };
                    };

                    console.log(logPrefix, "Overridden getStreamerActiveStreamMetadata for quest", questName, "appId:", applicationId, "pid:", pid);

                    var fnStream = function(data) {
                        if (!data || !data.userStatus) return;
                        var progress = quest.config.configVersion === 1
                            ? data.userStatus.streamProgressSeconds
                            : Math.floor(data.userStatus.progress && data.userStatus.progress.STREAM_ON_DESKTOP && data.userStatus.progress.STREAM_ON_DESKTOP.value || 0);
                        console.log(logPrefix, "Quest progress for", questName + ":", progress + "/" + secondsNeeded);

                        if (progress >= secondsNeeded) {
                            console.log(logPrefix, "Quest completed:", questName);

                            ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;

                            if (typeof FluxDispatcher.unsubscribe === "function") {
                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fnStream);
                            }

                            doJob();
                        }
                    };

                    if (typeof FluxDispatcher.subscribe === "function") {
                        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fnStream);
                        console.log(logPrefix, "Subscribed to QUESTS_SEND_HEARTBEAT_SUCCESS for STREAM_ON_DESKTOP quest", questName);
                    } else {
                        console.log(logPrefix, "FluxDispatcher.subscribe not available");
                    }

                    console.log(logPrefix, "Spoofed your stream to", applicationName, "for quest", questName, "stream any window in vc for about", Math.ceil((secondsNeeded - secondsDone) / 60), "more minutes");
                    console.log(logPrefix, "Remember you need at least 1 other person in the vc");
                }
            } else if (taskName === "PLAY_ACTIVITY") {
                var channelId = null;
                try {
                    var priv = ChannelStore.getSortedPrivateChannels && ChannelStore.getSortedPrivateChannels();
                    if (priv && priv[0] && priv[0].id) {
                        channelId = priv[0].id;
                        console.log(logPrefix, "Using private channel for PLAY_ACTIVITY quest", questName, "channelId:", channelId);
                    }
                } catch (e) {
                    console.log(logPrefix, "Error while resolving private channel for quest", questName, "error:", e);
                }

                if (!channelId) {
                    try {
                        var guilds = GuildChannelStore.getAllGuilds && GuildChannelStore.getAllGuilds();
                        if (guilds) {
                            var guildValues = Object.values(guilds);
                            for (var gi = 0; gi < guildValues.length; gi++) {
                                var g = guildValues[gi];
                                if (!g || !g.VOCAL || !g.VOCAL.length) continue;
                                var ch = g.VOCAL[0];
                                if (ch && ch.channel && ch.channel.id) {
                                    channelId = ch.channel.id;
                                    console.log(logPrefix, "Using guild vocal channel for PLAY_ACTIVITY quest", questName, "channelId:", channelId);
                                    break;
                                }
                            }
                        }
                    } catch (e) {
                        console.log(logPrefix, "Error while resolving guild channel for quest", questName, "error:", e);
                    }
                }

                if (!channelId) {
                    console.log(logPrefix, "Could not resolve a voice channel for PLAY_ACTIVITY quest", questName, "skipping");
                    doJob();
                    return;
                }

                var streamKey = "call:" + channelId + ":1";

                var fnActivity = async function() {
                    console.log(logPrefix, "Starting PLAY_ACTIVITY quest", questName, "streamKey:", streamKey, "secondsNeeded:", secondsNeeded);
                    while (true) {
                        var resHeartbeat;
                        try {
                            resHeartbeat = await api.post({ url: "/quests/" + quest.id + "/heartbeat", body: { stream_key: streamKey, terminal: false } });
                        } catch (e) {
                            console.log(logPrefix, "Heartbeat failed for quest", questName, "error:", e);
                            await new Promise(function(resolve) { setTimeout(resolve, 5000); });
                            continue;
                        }
                        var progress = resHeartbeat && resHeartbeat.body && resHeartbeat.body.progress && resHeartbeat.body.progress.PLAY_ACTIVITY && resHeartbeat.body.progress.PLAY_ACTIVITY.value || 0;
                        console.log(logPrefix, "Quest progress for", questName + ":", progress + "/" + secondsNeeded);

                        await new Promise(function(resolve) { setTimeout(resolve, 20 * 1000); });

                        if (progress >= secondsNeeded) {
                            try {
                                await api.post({ url: "/quests/" + quest.id + "/heartbeat", body: { stream_key: streamKey, terminal: true } });
                                console.log(logPrefix, "Sent final heartbeat for quest", questName);
                            } catch (e) {
                                console.log(logPrefix, "Final heartbeat failed for quest", questName, "error:", e);
                            }
                            break;
                        }
                    }
                    console.log(logPrefix, "Quest completed:", questName);
                    doJob();
                };
                fnActivity();
            } else {
                console.log(logPrefix, "Unsupported task", taskName, "for quest", questName, "skipping");
                doJob();
            }
        }

        console.log(logPrefix, "Starting quest processing with", quests.length, "quests in queue");
        doJob();
    });
})();
